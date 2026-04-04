package com.heka.calendar;

import android.content.Context;
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
 * Print adapter for an existing PDF file
 */
public class PdfFilePrintAdapter extends PrintDocumentAdapter {
    private static final String TAG = "PdfFilePrintAdapter";
    
    private final Context context;
    private final File pdfFile;
    private final int pageCount;
    
    public PdfFilePrintAdapter(Context context, File pdfFile, int pageCount) {
        this.context = context;
        this.pdfFile = pdfFile;
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
        
        PrintDocumentInfo info = new PrintDocumentInfo.Builder("HEKA Calendar")
            .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
            .setPageCount(pageCount)
            .build();
        
        callback.onLayoutFinished(info, true);
    }
    
    @Override
    public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                       CancellationSignal cancellationSignal, WriteResultCallback callback) {
        
        Log.d(TAG, "Writing PDF: " + pdfFile.getAbsolutePath());
        
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
            Log.d(TAG, "Wrote " + totalBytes + " bytes");
            
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
            
            // Delete temp file
            pdfFile.delete();
        }
    }
}
