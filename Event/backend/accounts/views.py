from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
import json
from .models import UserProfile


def home(request):
    return HttpResponse("Backend is working!")


def serialize_user(user):
    profile = getattr(user, "profile", None)
    full_name = " ".join(part for part in [user.first_name, user.last_name] if part).strip()
    return {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "name": full_name or user.username,
        "email": user.email,
        "phone": profile.phone if profile else "",
        "date_joined": user.date_joined.isoformat() if user.date_joined else "",
    }


@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = (data.get("username") or "").strip()
        password = data.get("password") or ""
        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get('last_name') or "").strip()
        email = (data.get("email") or "").strip()
        phone = (data.get("phone") or "").strip()

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        if email and User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        UserProfile.objects.create(user=user, phone=phone)

        return JsonResponse({
            "message": "Registered successfully",
            "user": serialize_user(user),
        }, status=201)
    return JsonResponse({'error': "Invalid request method"}, status=405)


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return JsonResponse({
                "message": "Login success",
                "user": serialize_user(user),
            })
           
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)
    return JsonResponse({'error': "Invalid request method"}, status=405)

@login_required
def get_user(request):
    return JsonResponse({"user": serialize_user(request.user)})

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})
