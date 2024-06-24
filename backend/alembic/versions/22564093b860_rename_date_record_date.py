"""rename date -> record_date

Revision ID: 22564093b860
Revises: 3e17918af4b2
Create Date: 2024-06-20 10:02:52.883804

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '22564093b860'
down_revision: Union[str, None] = '3e17918af4b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # 関連する外部キー制約の削除
    op.drop_constraint('progresses_ibfk_1', 'progresses', type_='foreignkey')

    # 既存の複合主キー制約を削除
    op.drop_constraint('pk_progresses', 'progresses', type_='primary')

    # 新しいカラムの追加
    op.add_column('progresses', sa.Column('record_date', sa.Date(), nullable=False))

    # 旧カラムの削除
    op.drop_column('progresses', 'date')

    # 新しい複合主キー制約の追加
    op.create_primary_key('pk_progresses', 'progresses', ['book_id', 'record_date'])

    # 関連する外部キー制約の再作成
    op.create_foreign_key('progresses_ibfk_1', 'progresses', 'books', ['book_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # 関連する外部キー制約の削除
    op.drop_constraint('progresses_ibfk_1', 'progresses', type_='foreignkey')

    # 新しい複合主キー制約を削除
    op.drop_constraint('pk_progresses', 'progresses', type_='primary')

    # 旧カラムの追加
    op.add_column('progresses', sa.Column('date', sa.DATE(), nullable=False))

    # 新しいカラムの削除
    op.drop_column('progresses', 'record_date')

    # 旧複合主キー制約の再作成
    op.create_primary_key('pk_progresses', 'progresses', ['book_id', 'date'])

    # 関連する外部キー制約の再作成
    op.create_foreign_key('progresses_ibfk_1', 'progresses', 'books', ['book_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###
