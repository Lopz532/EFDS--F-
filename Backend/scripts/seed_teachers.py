# scripts/seed_teachers.py
import os
from datetime import timedelta
from django.utils import timezone

# Arranca Django si ejecutas el script directamente
if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
    import django

    django.setup()

from django.contrib.auth import get_user_model
from core.models import Materia, Tarea, Classroom

User = get_user_model()


def run():
    print("Comenzando seed...")

    teachers = []
    for i in range(1, 6):
        username = f"teacher{i}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": f"{username}@example.com",
                "first_name": f"Teacher{i}",
                "last_name": "Auto",
                **({"role": "teacher"} if hasattr(User, "role") else {}),
                "is_staff": True,
                "is_active": True,
            },
        )
        user.set_password("pass123")
        user.save()
        teachers.append(user)
        print(f"Usuario: {username} {'(creado)' if created else '(existía)'}")

        classroom, _ = Classroom.objects.get_or_create(nombre=f"Salon {i}")

    created_materias = 0
    created_tareas = 0
    for t_idx, teacher in enumerate(teachers, start=1):
        for m in range(1, 6):
            nombre = f"Materia {t_idx}-{m}"
            descripcion = f"Descripción automática de {nombre}"
            materia, m_created = Materia.objects.get_or_create(
                nombre=nombre,
                defaults={"descripcion": descripcion, "creado_por": teacher},
            )
            if m_created:
                created_materias += 1
            else:
                if getattr(materia, "creado_por", None) is None:
                    materia.creado_por = teacher
                    materia.save()

            for j in range(2):
                titulo = f"Tarea {nombre} - #{j+1}"
                fecha_entrega = timezone.now() + timedelta(days=7 + j * 3 + t_idx)
                tarea, t_created = Tarea.objects.get_or_create(
                    titulo=titulo,
                    materia=materia,
                    defaults={
                        "descripcion": f"Actividad automática para {titulo}",
                        "fecha_entrega": fecha_entrega,
                        "creado_por": teacher,
                    },
                )
                if t_created:
                    created_tareas += 1

    print(f"Terminé: {len(teachers)} profesores (password: 'pass123')")
    print(f"Materias creadas: {created_materias}")
    print(f"Tareas creadas: {created_tareas}")
    print("Seed finalizado.")


# Ejecuta cuando se corre el archivo directamente
if __name__ == "__main__":
    run()
