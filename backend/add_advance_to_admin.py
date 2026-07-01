import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app import create_app
from app.extensions import db
from app.models import Role

app = create_app()

with app.app_context():
    # List the role names you want to give advance_payments access to
    target_roles = ["Tenant Admin"]   # ← change this list as needed

    for role_name in target_roles:
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            print(f"❌ Role '{role_name}' not found.")
            continue

        # Add all advance_payments.* permissions
        added = 0
        for action in ["view", "create", "edit", "delete"]:
            key = f"advance_payments.{action}"
            if key not in role.permissions:
                role.permissions.append(key)
                added += 1

        if added:
            print(f"✅ Added {added} advance_payments permission(s) to '{role_name}'")
        else:
            print(f"ℹ️ '{role_name}' already has all advance_payments permissions.")

    db.session.commit()
    print("🎉 Done.")