package com.heka.calendar;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Simple PDF file print adapter.
 * Much more reliable than WebView-based printing for large documents.
 */
public class PdfPrintAdapter extends PrintDocumentAdapter {
    private static final String TAG = "PdfPrintAdapter";
    
    private final Context context;
    private final File pdfFile;
    private final String jobName;
    private final int pageCount;
    
    public PdfPrintAdapter(Context context, File pdfFile, String jobName, int pageCount) {
        this.context = context;
        this.pdfFile = pdfFile;
        this.jobName = jobName;
        this.pageCount = pageCount;
    }
    
    @Override
    public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                         CancellationSignal cancellationSignal, LayoutResultCallback callback,
                         Bundle extras) {
        
        if (cancellationSignal.isCanceled()) {
            callback.onLayoutCancelled();
            return;
        }
        
        PrintDocumentInfo info = new PrintDocumentInfo.Builder(jobName)
            .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
            .setPageCount(pageCount)
            .build();
        
        callback.onLayoutFinished(info, true);
        Log.d(TAG, "Layout: " + pageCount + " pages");
    }
    
    @Override
    public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                       CancellationSignal cancellationSignal, WriteResultCallback callback) {
        
        Log.d(TAG, "Writing PDF file: " + pdfFile.getAbsolutePath());
        
        FileInputStream input = null;
        FileOutputStream output = null;
        
        try {
            input = new FileInputStream(pdfFile);
            output = new FileOutputStream(destination.getFileDescriptor());
            
            byte[] buffer = new byte[8192];
            int bytesRead;
            long totalBytes = 0;
            
            while ((bytesRead = input.read(buffer)) != -1) {
                if (cancellationSignal.isCanceled()) {
                    callback.onWriteCancelled();
                    return;
                }
                output.write(buffer, 0, bytesRead);
                totalBytes += bytesRead;
            }
            
            output.flush();
            callback.onWriteFinished(pages);
            Log.d(TAG, "Success! Wrote " + totalBytes + " bytes");
            
        } catch (Exception e) {
            Log.e(TAG, "Write failed", e);
            callback.onWriteFailed(e.getMessage());
        } finally {
            try {
                if (input != null) input.close();
                if (output != null) output.close();
            } catch (IOException e) {
                Log.w(TAG, "Close error", e);
            }
        }
    }
}
