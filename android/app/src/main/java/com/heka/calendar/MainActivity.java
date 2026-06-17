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
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        
        // Set transparent background
        webView.setBackgroundColor(0x00000000);
        webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
        
        // NOTE: Do NOT clear WebView caches on every launch.
        // clearCache(true) forces complete re-download of all JS/CSS/WASM assets
        // on every startup, causing 500-1000ms of main-thread blocking and
        // severe jank ("Skipped X frames!" / Davey warnings).
        // Cache invalidation is handled by Vite's content-hashed filenames.
        // webView.clearCache(true);
        // webView.clearHistory();
    }
}
