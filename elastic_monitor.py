"""
Κεντρικό αρχείο εκκίνησης της εφαρμογής.

Σκοπός:
- Εκκίνηση του Django Server.
- Εκκίνηση στο Port 9000.
- Σημείο εισόδου του project.

"""

import subprocess

PORT = 9000    # http://localhost:9000/

def start_server():
    """
    Εκκίνηση Django Development Server.
    """

    subprocess.run(
        [
            "python",
            "manage.py",
            "runserver",
            f"0.0.0.0:{PORT}"
        ]
    )


if __name__ == "__main__":
    start_server()