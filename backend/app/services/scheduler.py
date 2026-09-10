from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from bson import ObjectId

from app.database import reminders_collection, users_collection
from app.services.push_service import send_push_notification


scheduler = BackgroundScheduler()


def check_reminders():
    now = datetime.now()

    current_time = now.strftime("%H:%M")
    today = now.strftime("%Y-%m-%d")

    print(
        f"Checking reminders: {today} {current_time}"
    )

    reminders = list(
        reminders_collection.find({
            "active": True,
            "time": current_time,
            "start_date": {"$lte": today},
            "$or": [
                {"end_date": {"$gte": today}},
                {"end_date": None},
                {"end_date": ""},
                {"end_date": {"$exists": False}}
            ]
        })
    )

    for reminder in reminders:

        reminder_id = str(reminder["_id"])
        user_id = reminder.get("user_id")

        if not user_id:
            continue

        notification_key = (
            f"{reminder_id}_{today}_{current_time}"
        )

        if reminder.get("last_notification_key") == notification_key:
            continue

        try:
            user = users_collection.find_one(
                {"_id": ObjectId(user_id)}
            )

            if not user:
                print(
                    f"User not found for reminder {reminder_id}"
                )
                continue

            subscription = user.get(
                "push_subscription"
            )

            if not subscription:
                print(
                    f"No push subscription for user {user_id}"
                )
                continue

            medicine_name = reminder.get(
                "medicine_name",
                "your medicine"
            )

            dosage = reminder.get(
                "dosage",
                ""
            )

            body = (
                f"Time to take {medicine_name}"
            )

            if dosage:
                body += f" ({dosage})"

            success = send_push_notification(
                subscription=subscription,
                title="MediGuide AI 💊",
                body=body,
                data={
                    "type": "medicine_reminder",
                    "reminder_id": reminder_id,
                    "medicine_name": medicine_name
                }
            )

            if success:

                reminders_collection.update_one(
                    {"_id": reminder["_id"]},
                    {
                        "$set": {
                            "last_notification_key":
                                notification_key
                        }
                    }
                )

                print(
                    f"Reminder sent: "
                    f"{medicine_name} "
                    f"for user {user_id}"
                )

        except Exception as e:

            print(
                f"Error processing reminder "
                f"{reminder_id}: {e}"
            )


def start_scheduler():

    scheduler.add_job(
        check_reminders,
        "interval",
        minutes=1,
        id="medicine_reminder_scheduler",
        replace_existing=True
    )

    scheduler.start()

    print(
        "Medicine reminder scheduler started"
    )


def stop_scheduler():

    if scheduler.running:
        scheduler.shutdown()

        print(
            "Medicine reminder scheduler stopped"
        )