# Gmail.py

import sys
import smtplib
from email.mime.text import MIMEText

def send_mail(name, email, phone, from_location, to_location, weight):
    sender = "daniilefremov997@gmail.com"
    password = "padk yepa dldf mdjp"

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)

    try:
        server.login(sender, password)
        message = f"Имя: {name}\nПочта: {email}\nТелефон: {phone}\nГород отправки: {from_location}\nГород доставки: {to_location}\nВес груза: {weight}"
        msg = MIMEText(message)
        msg["Subject"] = "Новый заказ"
        server.sendmail(sender, sender, msg.as_string())

        return "Message sent successfully"

    except Exception as ex:
        return f"{ex}\nCheck"

if __name__ == "__main__":
    if len(sys.argv) == 7:
        name, email, phone, from_location, to_location, weight = sys.argv[1:]
        result = send_mail(name, email, phone, from_location, to_location, weight)
        print(result)
    else:
        print("Usage: python Gmail.py <name> <email> <phone> <from_location> <to_location> <weight>")
