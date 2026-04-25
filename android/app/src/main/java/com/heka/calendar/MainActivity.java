package com.heka.calendar;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

/**
 * MainActivity - Entry point for HEKA Calendar
 */
public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register custom plugins BEFORE super.onCreate() so the Bridge picks them up
        android.util.Log.d("MainActivity", "Registering HekaPrintPlugin before bridge creation");
        registerPlugin(HekaPrintPlugin.class);
        
        super.onCreate(savedInstanceState);
        
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        
        // Essential WebView settings
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Set transparent background
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // Clear WebView caches to ensure fresh content
        webView.clearCache(true);
        webView.clearHistory();
    }
}
