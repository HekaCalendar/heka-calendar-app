# ============================================================================
# HEKA Calendar Pro - ProGuard/R8 Rules
# ============================================================================

# --- Capacitor Core & Bridge ---
# Keep all plugin subclasses and their annotated methods (bridge uses reflection)
-keep public class * extends com.getcapacitor.Plugin {
    public <init>();
    @com.getcapacitor.annotation.PluginMethod <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * { *; }
-keep public class com.getcapacitor.** { *; }
-keep public class com.getcapacitor.plugin.** { *; }

# --- Capacitor Community Plugins ---
-keep public class com.getcapacitor.community.** { *; }

# --- Custom HEKA Plugins ---
-keep public class com.heka.calendar.** { *; }

# --- Firebase (keep rules are bundled with AARs; silence warnings only) ---
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# --- WebView JS Interface ---
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# --- Reflection & Serialization Attributes ---
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes SourceFile,LineNumberTable

# --- Native Methods ---
-keepclasseswithmembernames class * {
    native <methods>;
}

# --- Facebook (unused by HEKA but referenced by firebase-auth plugin) ---
-dontwarn com.facebook.CallbackManager$Factory
-dontwarn com.facebook.CallbackManager
-dontwarn com.facebook.FacebookCallback
-dontwarn com.facebook.login.LoginManager
-dontwarn com.facebook.login.widget.LoginButton

# --- Cordova Compatibility ---
-keep public class org.apache.cordova.** { *; }
-dontwarn org.apache.cordova.**
