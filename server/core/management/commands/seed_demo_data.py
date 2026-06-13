from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seed demo data for testing'

    def handle(self, *args, **options):
        # Demo users data
        demo_users = [
            {
                'email': 'super.admin@hirechamps.com',
                'username': 'super.admin@hirechamps.com',
                'password': 'SuperAdmin@123',
                'first_name': 'Super',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'email': 'owner@acmecorp.com',
                'username': 'owner@acmecorp.com',
                'password': 'CompanyOwner@123',
                'first_name': 'Alice',
                'last_name': 'Johnson',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'hr@acmecorp.com',
                'username': 'hr@acmecorp.com',
                'password': 'HRManager@123',
                'first_name': 'Bob',
                'last_name': 'Smith',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'john.doe@acmecorp.com',
                'username': 'john.doe@acmecorp.com',
                'password': 'Employee@123',
                'first_name': 'John',
                'last_name': 'Doe',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'jane.smith@acmecorp.com',
                'username': 'jane.smith@acmecorp.com',
                'password': 'Employee@123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'is_staff': False,
                'is_superuser': False,
            },
        ]

        created_count = 0
        skipped_count = 0

        for user_data in demo_users:
            email = user_data['email']
            password = user_data.pop('password')

            if User.objects.filter(email=email).exists():
                self.stdout.write(
                    self.style.WARNING(f'User {email} already exists, skipping...')
                )
                skipped_count += 1
                continue

            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(f'Created user: {email}')
            )
            created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Demo data seeding complete!\n'
                f'Created: {created_count} users\n'
                f'Skipped: {skipped_count} users\n\n'
                f'Demo Credentials:\n'
                f'─────────────────────────────────────\n'
                f'Super Admin:\n'
                f'  Email: super.admin@hirechamps.com\n'
                f'  Password: SuperAdmin@123\n\n'
                f'Company Owner:\n'
                f'  Email: owner@acmecorp.com\n'
                f'  Password: CompanyOwner@123\n\n'
                f'HR Manager:\n'
                f'  Email: hr@acmecorp.com\n'
                f'  Password: HRManager@123\n\n'
                f'Employees:\n'
                f'  Email: john.doe@acmecorp.com\n'
                f'  Password: Employee@123\n\n'
                f'  Email: jane.smith@acmecorp.com\n'
                f'  Password: Employee@123\n'
                f'─────────────────────────────────────\n'
            )
        )
