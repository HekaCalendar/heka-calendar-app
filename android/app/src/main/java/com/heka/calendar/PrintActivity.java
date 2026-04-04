package com.heka.calendar;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * PrintActivity - Loads HTML and triggers system print dialog
 * 
 * Uses Android's native WebView print adapter which automatically
 * handles pagination based on @page CSS rules.
 */
public class PrintActivity extends Activity {
    
    private WebView webView;
    private static final int DELAY_MS = 500;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Get extras from intent
        String html = getIntent().getStringExtra("html");
        String orientation = getIntent().getStringExtra("orientation");
        String jobName = getIntent().getStringExtra("jobName");
        
        // Validate job name - cannot be null or empty
        if (jobName == null || jobName.trim().isEmpty()) {
            jobName = "HEKA Calendar Print";
        }
        
        if (html == null || html.isEmpty()) {
            finish();
            return;
        }
        
        final String finalJobName = jobName;
        
        // Create WebView on UI thread
        runOnUiThread(() -> {
            webView = new WebView(PrintActivity.this);
            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            
            webView.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    new Handler(Looper.getMainLooper()).postDelayed(() -> doPrint(orientation, finalJobName), DELAY_MS);
                }
            });
            
            webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
        });
    }
    
    private void doPrint(String orientation, String jobName) {
        // Ensure we're on the UI thread for all View operations
        runOnUiThread(() -> {
            try {
                PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                if (printManager == null) {
                    finish();
                    return;
                }
                
                // Create adapter on UI thread
                PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
                
                PrintAttributes.Builder builder = new PrintAttributes.Builder();
                if ("landscape".equals(orientation)) {
                    builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape());
                } else {
                    builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4);
                }
                builder.setMinMargins(PrintAttributes.Margins.NO_MARGINS);
                
                printManager.print(jobName, adapter, builder.build());
            } catch (Exception e) {
                e.printStackTrace();
                finish();
            }
        });
    }
}
