package com.heka.calendar;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;

import com.capacitorjs.plugins.localnotifications.LocalNotification;
import com.capacitorjs.plugins.localnotifications.LocalNotificationManager;
import com.capacitorjs.plugins.localnotifications.LocalNotificationSchedule;
import com.capacitorjs.plugins.localnotifications.NotificationStorage;
import com.getcapacitor.CapConfig;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * HekaBootReceiver — Reschedules critical daily notifications after device reboot.
 *
 * The Capacitor LocalNotifications plugin already restores its own scheduled
 * notifications via LocalNotificationRestoreReceiver. This receiver adds a
 * safety net: if the user hasn't opened the app recently and daily notifications
 * (briefing, tips, streak saver, evening reflection) weren't in the plugin's
 * storage, we schedule basic fallback versions so the user doesn't miss them.
 */
public class HekaBootReceiver extends BroadcastReceiver {

    private static final String TAG = "HekaBootReceiver";

    // Critical notification IDs (must not conflict with engine ID ranges)
    private static final int ID_DAILY_BRIEFING = 900001;
    private static final int ID_DAILY_TIPS = 900002;
    private static final int ID_STREAK_SAVER = 900003;
    private static final int ID_EVENING_REFLECTION = 900004;

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action == null) return;

        if (!action.equals(Intent.ACTION_BOOT_COMPLETED)
                && !action.equals("android.intent.action.QUICKBOOT_POWERON")
                && !action.equals("android.intent.action.LOCKED_BOOT_COMPLETED")) {
            return;
        }

        Log.i(TAG, "Boot completed — ensuring critical notifications are scheduled");

        try {
            NotificationStorage storage = new NotificationStorage(context);
            CapConfig config = CapConfig.loadDefault(context);
            LocalNotificationManager manager = new LocalNotificationManager(storage, null, context, config);

            // Build fallback notifications for the next 24h
            List<LocalNotification> notifications = buildCriticalNotifications(context);

            // Schedule the fallbacks (ids are stable, so re-scheduling replaces existing)
            if (!notifications.isEmpty()) {
                manager.schedule(null, notifications);
                Log.i(TAG, "Scheduled " + notifications.size() + " critical fallback notifications");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule fallback notifications", e);
        }
    }

    private List<LocalNotification> buildCriticalNotifications(Context context) {
        List<LocalNotification> list = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        int hour = cal.get(Calendar.HOUR_OF_DAY);
        int minute = cal.get(Calendar.MINUTE);
        int currentMinutes = hour * 60 + minute;

        // Daily Briefing at 07:00
        list.add(buildNotification(
                ID_DAILY_BRIEFING,
                "Your Celestial Briefing",
                "The day unfolds in its own rhythm. Open HEKA for your full celestial overview.",
                7, 0, currentMinutes, cal
        ));

        // Daily Celestial Tips at 08:00
        list.add(buildNotification(
                ID_DAILY_TIPS,
                "Celestial Tip",
                "The cosmos has something to share with you today. Open HEKA to receive it.",
                8, 0, currentMinutes, cal
        ));

        // Streak Saver at 20:00
        list.add(buildNotification(
                ID_STREAK_SAVER,
                "Streak Saver",
                "Your daily rhythm calls. One small action keeps the pattern alive.",
                20, 0, currentMinutes, cal
        ));

        // Evening Reflection at 20:00
        list.add(buildNotification(
                ID_EVENING_REFLECTION,
                "Evening Reflection",
                "Take a breath. Look back at the day. What surfaced? What settled?",
                20, 0, currentMinutes, cal
        ));

        return list;
    }

    private LocalNotification buildNotification(
            int id,
            String title,
            String body,
            int targetHour,
            int targetMinute,
            int currentMinutes,
            Calendar cal
    ) {
        int targetMinutes = targetHour * 60 + targetMinute;
        boolean isTomorrow = currentMinutes >= targetMinutes;

        Calendar scheduleCal = (Calendar) cal.clone();
        scheduleCal.set(Calendar.HOUR_OF_DAY, targetHour);
        scheduleCal.set(Calendar.MINUTE, targetMinute);
        scheduleCal.set(Calendar.SECOND, 0);
        scheduleCal.set(Calendar.MILLISECOND, 0);

        if (isTomorrow) {
            scheduleCal.add(Calendar.DAY_OF_YEAR, 1);
        }

        LocalNotification notification = new LocalNotification();
        notification.setId(id);
        notification.setTitle(title);
        notification.setBody(body);
        notification.setChannelId("heka_standard");
        notification.setSmallIcon("ic_notification");
        notification.setIconColor("#c9a227");

        LocalNotificationSchedule schedule = new LocalNotificationSchedule();
        schedule.setAt(scheduleCal.getTime());
        notification.setSchedule(schedule);

        return notification;
    }
}
