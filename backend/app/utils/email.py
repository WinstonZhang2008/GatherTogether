from flask_mail import Message
from app import mail

_BASE = 'http://127.0.0.1:5500/GatherTogether/frontend/index.html'


def _send(msg):
    try:
        mail.send(msg)
    except Exception:
        pass


def send_verification_email(to_email: str, name: str, token: str):
    verify_url = 'http://localhost:5000/auth/verify/' + token
    msg = Message(
        subject='Confirm your GatherTogether email',
        recipients=[to_email],
        html="""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F6FAF8;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #D6E8E1;">
    <div style="background:#1D9E75;padding:32px;">
      <div style="font-size:24px;font-weight:800;color:#fff;">Gather</div>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:22px;font-weight:700;color:#111714;margin:0 0 12px;">Hey {name}, confirm your email 👋</h1>
      <p style="font-size:15px;color:#4A5751;line-height:1.6;margin:0 0 28px;">
        Thanks for signing up for GatherTogether! Click the button below to verify your email and activate your account.
      </p>
      <a href="{verify_url}" style="display:inline-block;background:#1D9E75;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
        Confirm my email
      </a>
      <p style="font-size:12px;color:#9AADA6;margin-top:24px;">
        This link expires in 24 hours. If you didn't sign up, you can ignore this email.
      </p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #D6E8E1;">
      <p style="font-size:12px;color:#9AADA6;margin:0;">The Gather Team</p>
    </div>
  </div>
</body>
</html>
""".format(name=name, verify_url=verify_url)
    )
    _send(msg)


def send_welcome_email(to_email: str, name: str):
    msg = Message(
        subject='Welcome to GatherTogether!',
        recipients=[to_email],
        html="""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F6FAF8;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #D6E8E1;">
    <div style="background:#1D9E75;padding:32px;">
      <div style="font-size:24px;font-weight:800;color:#fff;">Gather</div>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:22px;font-weight:700;color:#111714;margin:0 0 12px;">Hey {name}, welcome! 👋</h1>
      <p style="font-size:15px;color:#4A5751;line-height:1.6;margin:0 0 28px;">
        Thanks for joining GatherTogether. Start planning your first group hangout!
      </p>
      <a href="{base}" style="display:inline-block;background:#1D9E75;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
        Open Gather
      </a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #D6E8E1;">
      <p style="font-size:12px;color:#9AADA6;margin:0;">The Gather Team</p>
    </div>
  </div>
</body>
</html>
""".format(name=name, base=_BASE)
    )
    _send(msg)
