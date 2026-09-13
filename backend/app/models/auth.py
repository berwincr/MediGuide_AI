from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):             #Create a user login object
    email: EmailStr        #EmailStr : Pydantic type for email address 
    password: str