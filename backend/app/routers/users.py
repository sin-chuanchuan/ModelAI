from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserInDB
from app.deps import get_current_user 

router = APIRouter(
    tags=["users"]
)

@router.get("/me", response_model=UserInDB)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    """Get current user profile."""
    return current_user

@router.get("/balance")
async def read_balance(current_user: UserInDB = Depends(get_current_user)):
    """Get current user balance."""
    return {"balance": current_user.balance}
