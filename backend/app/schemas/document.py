from pydantic import BaseModel


class DocumentResponse(BaseModel):
    success: bool
    filename: str
    file_type: str
    text: str

