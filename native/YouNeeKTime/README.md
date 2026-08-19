# YouNeeK Time for Apple Watch

Apple Watch cannot run the Vite website. This folder is a native **iOS + watchOS** app that uses the same decimal-time math as `src/lib/decimalTime.js`.

## Install on a watch

1. Open `native/YouNeeKTime/YouNeeKTime.xcodeproj` in Xcode 16+ on a Mac.
2. Select the **YouNeeKTime** target → Signing & Capabilities → your Team.
3. Repeat for **YouNeeKTime Watch App** and **YouNeeKTimeWatchWidgets**.
4. Plug in iPhone + Apple Watch (or pick a Watch simulator).
5. Scheme **YouNeeKTime Watch App** → Run.

The watch app is independent (`WKRunsIndependentlyOfCompanionApp`). Swipe between **Clock Face**, **Decimal Clock**, and **Settings**. Settings pick Regular / YouNeeK Time / Pineal Army / YouNeeK Digital for the digits, analog hands, and (on the phone) haptic telling.

Bundle IDs: `com.youneek.time`, `com.youneek.time.watchkitapp`, `com.youneek.time.watchkitapp.widgets`.
