package com.heka.calendar;

import android.content.Intent;
import android.net.Uri;
import androidx.core.content.FileProvider;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;

/**
 * Simple plugin to open HTML files in Chrome for printing
 * Uses FileProvider to properly share files with other apps
 */
@CapacitorPlugin(name = "HekaPrintLauncher")
public class HekaPrintLauncherPlugin extends Plugin {

    @PluginMethod
    public void openInChrome(PluginCall call) {
        String filePath = call.getString("filePath");
        
        if (filePath == null || filePath.isEmpty()) {
            call.reject("No file path provided");
            return;
        }
        
        try {
            // Robust file path parsing: handle both file:// URIs and plain paths
            String path;
            if (filePath.startsWith("file://")) {
                Uri uri = Uri.parse(filePath);
                path = uri.getPath();
                if (path == null || path.isEmpty()) {
                    call.reject("Invalid file URI: " + filePath);
                    return;
                }
            } else {
                path = filePath;
            }
            File file = new File(path);
            
            if (!file.exists()) {
                call.reject("File does not exist: " + path);
                return;
            }
            
            // Create content URI using FileProvider
            Uri contentUri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                file
            );
            
            // Create intent to open in Chrome
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(contentUri, "text/html");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            
            // Try Chrome specifically first
            intent.setPackage("com.android.chrome");
            
            if (intent.resolveActivity(getContext().getPackageManager()) != null) {
                getContext().startActivity(intent);
                call.resolve();
            } else {
                // Fallback to any browser
                intent.setPackage(null);
                getContext().startActivity(intent);
                call.resolve();
            }
            
        } catch (Exception e) {
            call.reject("Failed to open file: " + e.getMessage());
        }
    }
}
