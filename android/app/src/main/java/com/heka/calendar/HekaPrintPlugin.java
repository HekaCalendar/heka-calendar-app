package com.heka.calendar;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.app.ProgressDialog;
import android.app.AlertDialog;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.print.pdf.PrintedPdfDocument;
import android.graphics.pdf.PdfDocument;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Color;
import android.graphics.Picture;
import android.graphics.Bitmap;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.core.content.FileProvider;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@CapacitorPlugin(name = "HekaPrint")
public class HekaPrintPlugin extends Plugin {
    private static final String TAG = "HekaPrint";
    private static final long PAGE_LOAD_TIMEOUT_MS = 30000;
    private AlertDialog progressDialog;
    
    // Paper sizes in POINTS (72 DPI) - used for PDF page info
    private static final Map<String, PaperDimensions> PAPER_SIZES_POINTS = new HashMap<>();
    static {
        PAPER_SIZES_POINTS.put("A4", new PaperDimensions(595, 842));
        PAPER_SIZES_POINTS.put("A3", new PaperDimensions(842, 1191));
        PAPER_SIZES_POINTS.put("Letter", new PaperDimensions(612, 792));
        PAPER_SIZES_POINTS.put("Legal", new PaperDimensions(612, 1008));
    }
    
    // Paper sizes in PIXELS (150 DPI) - used for WebView rendering
    // Must match the TypeScript side dimensions exactly
    private static final Map<String, PaperDimensions> PAPER_SIZES_PIXELS = new HashMap<>();
    static {
        // A4: 210mm x 297mm at 150 DPI
        PAPER_SIZES_PIXELS.put("A4", new PaperDimensions(1240, 1754));
        // A3: 297mm x 420mm at 150 DPI (2x A4 area)
        PAPER_SIZES_PIXELS.put("A3", new PaperDimensions(1754, 2480));
        // Letter: 8.5" x 11" at 150 DPI = 1275 x 1650
        PAPER_SIZES_PIXELS.put("Letter", new PaperDimensions(1275, 1650));
        // Legal: 8.5" x 14" at 150 DPI = 1275 x 2100
        PAPER_SIZES_PIXELS.put("Legal", new PaperDimensions(1275, 2100));
    }

    @PluginMethod
    public void checkNetworkStatus(PluginCall call) {
        JSObject result = new JSObject();
        result.put("isOnline", isNetworkAvailable());
        call.resolve(result);
    }

    @PluginMethod
    public void generatePDF(PluginCall call) {
        android.util.Log.d(TAG, "generatePDF called");
        try {
            PrintRequest request = parseRequest(call);
            
            if (request.pages.isEmpty()) {
                call.reject("No pages to print");
                return;
            }

            showProgressDialog("Generating PDF... This may take a moment.");
            
            getActivity().runOnUiThread(() -> {
                generatePDFFromHTML(request, call);
            });
            
        } catch (Exception e) {
            hideProgressDialog();
            android.util.Log.e(TAG, "Error in generatePDF", e);
            call.reject("Invalid print request: " + e.getMessage());
        }
    }

    @PluginMethod
    public void printPDF(PluginCall call) {
        android.util.Log.d(TAG, "printPDF called");
        try {
            String filePath = call.getString("filePath");
            String orientation = call.getString("orientation", "portrait");
            String paperSize = call.getString("paperSize", "A4");
            if (filePath == null || filePath.isEmpty()) {
                call.reject("No file path provided");
                return;
            }

            File pdfFile = new File(filePath);
            if (!pdfFile.exists()) {
                call.reject("PDF file not found: " + filePath);
                return;
            }

            if (!isNetworkAvailable()) {
                call.reject("PRINT_NETWORK_REQUIRED");
                return;
            }

            getActivity().runOnUiThread(() -> {
                showProgressDialog("Preparing to print...");
                try {
                    printExistingPDF(pdfFile, orientation, paperSize, call);
                } finally {
                    // Hide dialog after a short delay to let the print dialog appear
                    new Handler(Looper.getMainLooper()).postDelayed(() -> {
                        hideProgressDialog();
                    }, 1500);
                }
            });
            
        } catch (Exception e) {
            hideProgressDialog();
            android.util.Log.e(TAG, "Error in printPDF", e);
            call.reject("Print failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void sharePDF(PluginCall call) {
        android.util.Log.d(TAG, "sharePDF called");
        try {
            String filePath = call.getString("filePath");
            String filename = call.getString("filename", "HEKA_Calendar.pdf");
            
            if (filePath == null || filePath.isEmpty()) {
                call.reject("No file path provided");
                return;
            }

            File pdfFile = new File(filePath);
            if (!pdfFile.exists()) {
                call.reject("PDF file not found");
                return;
            }

            Uri uri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                pdfFile
            );

            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("application/pdf");
            shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, filename);
            shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            
            Intent chooser = Intent.createChooser(shareIntent, "Share PDF");
            getActivity().startActivity(chooser);
            
            call.resolve();
            
        } catch (Exception e) {
            android.util.Log.e(TAG, "Error in sharePDF", e);
            call.reject("Share failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void openPDF(PluginCall call) {
        android.util.Log.d(TAG, "openPDF called");
        try {
            String filePath = call.getString("filePath");
            
            if (filePath == null || filePath.isEmpty()) {
                call.reject("No file path provided");
                return;
            }

            File pdfFile = new File(filePath);
            if (!pdfFile.exists()) {
                call.reject("PDF file not found");
                return;
            }

            Uri uri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                pdfFile
            );

            Intent openIntent = new Intent(Intent.ACTION_VIEW);
            openIntent.setDataAndType(uri, "application/pdf");
            openIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            openIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
            
            // Always show chooser - let user pick Chrome, Drive, or any PDF app
            Intent chooser = Intent.createChooser(openIntent, "Open PDF with");
            getActivity().startActivity(chooser);
            call.resolve();
            
        } catch (Exception e) {
            android.util.Log.e(TAG, "Error in openPDF", e);
            call.reject("Open failed: " + e.getMessage());
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        return activeNetwork != null && activeNetwork.isConnected();
    }

    private void showProgressDialog(String message) {
        getActivity().runOnUiThread(() -> {
            if (progressDialog != null && progressDialog.isShowing()) {
                progressDialog.dismiss();
            }
            AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
            builder.setMessage(message);
            builder.setCancelable(false);
            progressDialog = builder.create();
            progressDialog.show();
        });
    }

    private void hideProgressDialog() {
        getActivity().runOnUiThread(() -> {
            if (progressDialog != null && progressDialog.isShowing()) {
                progressDialog.dismiss();
                progressDialog = null;
            }
        });
    }

    /**
     * Generate PDF using Android's PdfDocument with proper scaling
     */
    private void generatePDFFromHTML(PrintRequest req, PluginCall call) {
        android.util.Log.d(TAG, "generatePDFFromHTML started with " + req.pages.size() + " pages");
        
        // Create output file
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(new Date());
        String filename = req.filename + "_" + timestamp + ".pdf";
        File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        if (!downloadsDir.exists()) {
            downloadsDir.mkdirs();
        }
        final File pdfFile = new File(downloadsDir, filename);
        android.util.Log.d(TAG, "PDF will be saved to: " + pdfFile.getAbsolutePath());
        
        // Process pages sequentially
        final int[] currentPage = {0};
        final Handler mainHandler = new Handler(Looper.getMainLooper());
        final List<PdfDocument.Page> pdfPages = new ArrayList<>();
        final PdfDocument pdfDocument = new PdfDocument();
        
        Runnable processNextPage = new Runnable() {
            @Override
            public void run() {
                if (currentPage[0] >= req.pages.size()) {
                    // All pages processed, write PDF
                    writePdfDocument(pdfDocument, pdfFile, call);
                    return;
                }
                
                // Use dimensions from request (already calculated based on paper size and orientation)
                android.util.Log.d(TAG, "Processing page with orientation: " + req.orientation);
                int pixelWidth = req.pageWidth;   // 150 DPI for WebView
                int pixelHeight = req.pageHeight;
                
                // Get point dimensions (72 DPI) for PDF page
                PaperDimensions pointDims = PAPER_SIZES_POINTS.get(req.paperSize);
                int pointWidth = req.orientation.equals("landscape") ? pointDims.height : pointDims.width;
                int pointHeight = req.orientation.equals("landscape") ? pointDims.width : pointDims.height;
                
                android.util.Log.d(TAG, "Selected dimensions: pixels=" + pixelWidth + "x" + pixelHeight + 
                    ", points=" + pointWidth + "x" + pointHeight);
                
                renderPageToPdf(req.pages.get(currentPage[0]), pdfDocument, pixelWidth, pixelHeight, 
                    pointWidth, pointHeight, () -> {
                    currentPage[0]++;
                    mainHandler.post(this);
                });
            }
        };
        
        mainHandler.post(processNextPage);
    }
    
    private interface PdfPageCallback {
        void onRendered();
    }
    
    private void renderPageToPdf(String html, PdfDocument pdfDocument, int pixelWidth, int pixelHeight, 
            int pointWidth, int pointHeight, PdfPageCallback callback) {
        android.util.Log.d(TAG, "renderPageToPdf: pixels=" + pixelWidth + "x" + pixelHeight + 
            ", points=" + pointWidth + "x" + pointHeight);
        WebView webView = createPrintWebView(pixelWidth, pixelHeight);
        final AtomicBoolean completed = new AtomicBoolean(false);
        final Handler timeoutHandler = new Handler(Looper.getMainLooper());
        
        Runnable timeoutRunnable = () -> {
            if (!completed.get()) {
                completed.set(true);
                destroyWebView(webView);
                callback.onRendered();
            }
        };
        
        timeoutHandler.postDelayed(timeoutRunnable, PAGE_LOAD_TIMEOUT_MS);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                // Wait for content to render
                timeoutHandler.postDelayed(() -> {
                    if (completed.get()) return;
                    completed.set(true);
                    timeoutHandler.removeCallbacks(timeoutRunnable);
                    
                    // Measure and layout the WebView at PIXEL dimensions (150 DPI)
                    view.measure(
                        View.MeasureSpec.makeMeasureSpec(pixelWidth, View.MeasureSpec.EXACTLY),
                        View.MeasureSpec.makeMeasureSpec(pixelHeight, View.MeasureSpec.EXACTLY)
                    );
                    view.layout(0, 0, pixelWidth, pixelHeight);
                    
                    // Capture WebView to Picture at pixel dimensions
                    Picture picture = new Picture();
                    Canvas pictureCanvas = picture.beginRecording(pixelWidth, pixelHeight);
                    view.draw(pictureCanvas);
                    picture.endRecording();
                    
                    // Create PDF page at POINT dimensions (72 DPI)
                    android.util.Log.d(TAG, "Creating PDF page: " + pointWidth + "x" + pointHeight);
                    PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(
                        pointWidth, pointHeight, pdfDocument.getPages().size() + 1).create();
                    PdfDocument.Page page = pdfDocument.startPage(pageInfo);
                    
                    // Draw white background
                    Canvas canvas = page.getCanvas();
                    canvas.drawColor(Color.WHITE);
                    
                    // Calculate scale factor: points/pixels = 72/150 ≈ 0.48
                    float scaleX = (float) pointWidth / pixelWidth;
                    float scaleY = (float) pointHeight / pixelHeight;
                    android.util.Log.d(TAG, "Drawing with scale: " + scaleX + "x" + scaleY);
                    
                    // Draw the Picture to PDF with scaling
                    canvas.save();
                    canvas.scale(scaleX, scaleY);
                    canvas.drawPicture(picture);
                    canvas.restore();
                    pdfDocument.finishPage(page);
                    
                    destroyWebView(webView);
                    callback.onRendered();
                    
                }, 2500); // 2.5s for content to render including fonts
            }
            
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (completed.get()) return;
                completed.set(true);
                timeoutHandler.removeCallbacks(timeoutRunnable);
                destroyWebView(webView);
                callback.onRendered();
            }
        });
        
        // Load the HTML directly
        try {
            File tempFile = new File(getContext().getCacheDir(), "print_page_" + System.currentTimeMillis() + ".html");
            try (FileWriter writer = new FileWriter(tempFile)) {
                writer.write(html);
            }
            
            getActivity().addContentView(webView, webView.getLayoutParams());
            webView.loadUrl("file://" + tempFile.getAbsolutePath());
            tempFile.deleteOnExit();
            
        } catch (Exception e) {
            android.util.Log.e(TAG, "Error creating temp file", e);
            completed.set(true);
            destroyWebView(webView);
            callback.onRendered();
        }
    }
    
    private void writePdfDocument(PdfDocument pdfDocument, File pdfFile, PluginCall call) {
        try {
            try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
                pdfDocument.writeTo(fos);
            }
            
            int pageCount = pdfDocument.getPages().size();
            pdfDocument.close();
            
            JSObject result = new JSObject();
            result.put("filePath", pdfFile.getAbsolutePath());
            result.put("filename", pdfFile.getName());
            result.put("pageCount", pageCount);
            android.util.Log.d(TAG, "PDF saved successfully: " + pdfFile.getAbsolutePath() + " (" + pageCount + " pages)");
            
            // Hide progress dialog before showing notification
            hideProgressDialog();
            
            // Show download notification
            showDownloadNotification(pdfFile);
            
            call.resolve(result);
            
        } catch (IOException e) {
            android.util.Log.e(TAG, "Error writing PDF", e);
            pdfDocument.close();
            hideProgressDialog();
            call.reject("Failed to write PDF: " + e.getMessage());
        }
    }

    private WebView createPrintWebView(int pageWidth, int pageHeight) {
        android.util.Log.d(TAG, "createPrintWebView: " + pageWidth + "x" + pageHeight);
        WebView webView = new WebView(getContext());
        
        // Set layout params to exact page dimensions
        webView.setLayoutParams(new android.view.ViewGroup.LayoutParams(pageWidth, pageHeight));
        
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setDomStorageEnabled(true);
        // Disable viewport scaling to get exact pixel dimensions
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setDefaultFontSize(16);
        
        // Set initial scale to 100%
        webView.setInitialScale(100);
        
        // Use software rendering for consistent screenshots
        webView.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        
        // Disable scrollbars - they can cause layout shifts
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        
        return webView;
    }

    private void printExistingPDF(File pdfFile, String orientation, String paperSize, PluginCall call) {
        try {
            PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
            if (pm == null) {
                call.reject("Print service not available");
                return;
            }

            PrintDocumentAdapter adapter = new PDFDocumentAdapter(getContext(), pdfFile);
            
            PrintAttributes.Builder builder = new PrintAttributes.Builder();
            // Set media size based on paper size and orientation
            PrintAttributes.MediaSize mediaSize = getMediaSize(paperSize, orientation);
            builder.setMediaSize(mediaSize);
            builder.setMinMargins(new PrintAttributes.Margins(0, 0, 0, 0));
            
            pm.print("HEKA Calendar", adapter, builder.build());
            call.resolve();
            
        } catch (Exception e) {
            android.util.Log.e(TAG, "Print failed", e);
            call.reject("Print failed: " + e.getMessage());
        }
    }
    
    private PrintAttributes.MediaSize getMediaSize(String paperSize, String orientation) {
        PrintAttributes.MediaSize baseSize;
        switch (paperSize) {
            case "A3":
                baseSize = PrintAttributes.MediaSize.ISO_A3;
                break;
            case "Letter":
                baseSize = PrintAttributes.MediaSize.NA_LETTER;
                break;
            case "Legal":
                baseSize = PrintAttributes.MediaSize.NA_LEGAL;
                break;
            case "A4":
            default:
                baseSize = PrintAttributes.MediaSize.ISO_A4;
                break;
        }
        return "landscape".equals(orientation) ? baseSize.asLandscape() : baseSize;
    }

    private PrintRequest parseRequest(PluginCall call) throws JSONException {
        PrintRequest req = new PrintRequest();
        
        req.paperSize = call.getString("paperSize", "A4");
        PaperDimensions dimsPixels = PAPER_SIZES_PIXELS.get(req.paperSize);
        if (dimsPixels == null) throw new IllegalArgumentException("Invalid paper size: " + req.paperSize);
        
        req.orientation = call.getString("orientation", "portrait");
        android.util.Log.d(TAG, "Parsed orientation: " + req.orientation);
        android.util.Log.d(TAG, "Parsed paperSize: " + req.paperSize + " pixels=" + dimsPixels.width + "x" + dimsPixels.height);
        if (req.orientation.equals("landscape")) {
            req.pageWidth = dimsPixels.height;
            req.pageHeight = dimsPixels.width;
        } else {
            req.pageWidth = dimsPixels.width;
            req.pageHeight = dimsPixels.height;
        }
        
        JSArray pagesArray = call.getArray("pages");
        req.pages = new ArrayList<>();
        for (int i = 0; i < pagesArray.length(); i++) {
            String page = pagesArray.getString(i);
            if (page != null && !page.isEmpty()) {
                req.pages.add(page);
            }
        }
        
        req.filename = call.getString("filename", "HEKA_Calendar");
        
        return req;
    }

    private void destroyWebView(WebView webView) {
        if (webView != null) {
            if (webView.getParent() != null) {
                ((android.view.ViewGroup) webView.getParent()).removeView(webView);
            }
            webView.destroy();
        }
    }

    private void showDownloadNotification(File pdfFile) {
        try {
            String channelId = "pdf_downloads";
            String channelName = "PDF Downloads";
            
            // Create notification channel for Android O+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                    channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT);
                channel.setDescription("Calendar PDF downloads");
                NotificationManager notificationManager = getContext().getSystemService(NotificationManager.class);
                notificationManager.createNotificationChannel(channel);
            }
            
            // Create intent to open PDF
            Uri uri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                pdfFile
            );
            Intent openIntent = new Intent(Intent.ACTION_VIEW);
            openIntent.setDataAndType(uri, "application/pdf");
            openIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                getContext(), 0, openIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            
            // Build notification
            NotificationCompat.Builder builder = new NotificationCompat.Builder(getContext(), channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Calendar PDF saved")
                .setContentText(pdfFile.getName() + " saved to Downloads")
                .setSubText("Tap to open")
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
            
            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getContext());
            notificationManager.notify((int) System.currentTimeMillis(), builder.build());
            
        } catch (Exception e) {
            android.util.Log.e(TAG, "Failed to show notification", e);
        }
    }

    private static class PDFDocumentAdapter extends PrintDocumentAdapter {
        private final Context context;
        private final File pdfFile;

        PDFDocumentAdapter(Context context, File pdfFile) {
            this.context = context;
            this.pdfFile = pdfFile;
        }

        @Override
        public void onLayout(PrintAttributes oldAttributes, 
                            PrintAttributes newAttributes, 
                            CancellationSignal cancellationSignal, 
                            LayoutResultCallback callback, 
                            Bundle extras) {
            if (cancellationSignal.isCanceled()) {
                callback.onLayoutCancelled();
                return;
            }
            
            PrintDocumentInfo info = new PrintDocumentInfo.Builder(pdfFile.getName())
                .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN)
                .build();
            
            callback.onLayoutFinished(info, true);
        }

        @Override
        public void onWrite(PageRange[] pages, 
                           ParcelFileDescriptor destination, 
                           CancellationSignal cancellationSignal, 
                           WriteResultCallback callback) {
            try (FileInputStream in = new FileInputStream(pdfFile);
                 FileOutputStream out = new FileOutputStream(destination.getFileDescriptor())) {
                
                byte[] buf = new byte[4096];
                int len;
                while ((len = in.read(buf)) > 0 && !cancellationSignal.isCanceled()) {
                    out.write(buf, 0, len);
                }
                
                if (cancellationSignal.isCanceled()) {
                    callback.onWriteCancelled();
                } else {
                    callback.onWriteFinished(new PageRange[]{PageRange.ALL_PAGES});
                }
            } catch (Exception e) {
                callback.onWriteFailed(e.getMessage());
            }
        }
    }

    private static class PrintRequest {
        String paperSize;
        String orientation;
        String filename;
        List<String> pages;
        int pageWidth;
        int pageHeight;
    }

    private static class PaperDimensions {
        final int width, height;
        PaperDimensions(int w, int h) {
            width = w;
            height = h;
        }
    }
}
