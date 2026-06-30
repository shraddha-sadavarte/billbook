from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db
import app.models  # noqa: F401  -- ensures models are registered before shell/migrate use

app = create_app()


@app.shell_context_processor
def make_shell_context():
    from app.models import Tenant, User, Customer, Product, Invoice, InvoiceItem

    return {
        "db": db,
        "Tenant": Tenant,
        "User": User,
        "Customer": Customer,
        "Product": Product,
        "Invoice": Invoice,
        "InvoiceItem": InvoiceItem,
    }


if __name__ == "__main__":
    app.run(debug=True, port=5000)
