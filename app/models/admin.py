from typing import Optional

from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import ConfigDict, BaseModel

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/admins/token"
)  # Admin view url


class Token(BaseModel):
    access_token: str
    is_sudo: bool
    token_type: str = "bearer"


class Admin(BaseModel):
    id: int | None = None
    username: str
    is_sudo: bool
    model_config = ConfigDict(from_attributes=True)


class AdminCreate(Admin):
    password: str

    @property
    def hashed_password(self):
        return pwd_context.hash(self.password)


class AdminModify(BaseModel):
    password: str
    is_sudo: bool

    @property
    def hashed_password(self):
        return pwd_context.hash(self.password)


class AdminPartialModify(AdminModify):
    __annotations__ = {
        k: Optional[v] for k, v in AdminModify.__annotations__.items()
    }


class AdminInDB(Admin):
    username: str
    hashed_password: str

    def verify_password(self, plain_password):
        return pwd_context.verify(plain_password, self.hashed_password)
