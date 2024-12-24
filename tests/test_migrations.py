import pytest
from pytest_alembic.tests import (
    test_model_definitions_match_ddl,
    test_single_head_revision,
    test_up_down_consistency,
    test_upgrade,
)


@pytest.mark.tryfirst
def test_model_definitions_match_ddl(alembic_engine, alembic_config):
    if "sqlite" in alembic_engine.url.drivername:
        pytest.skip("Skipping DDL test for SQLite database")
    from pytest_alembic.tests import test_model_definitions_match_ddl

    test_model_definitions_match_ddl(alembic_engine, alembic_config)
