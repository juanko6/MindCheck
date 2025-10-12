"""agregar campos de  verificacion para user

Revision ID: 2a7a9cca3821
Revises: b520f64d9eff
Create Date: 2025-10-12 20:00:32.041021

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a7a9cca3821'
down_revision: Union[str, None] = 'b520f64d9eff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
