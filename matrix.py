import time
import random

def print_matrix(rows, columns, duration):
    start_time = time.time()
    while time.time() - start_time < duration:
        row = ''.join(str(random.randint(0, 1)) for _ in range(columns))
        print(row)
        time.sleep(0.05)

# Adjust these values to change the size of the matrix
rows = 25
columns = 80
duration = 10  # Duration in seconds

print_matrix(rows, columns, duration)

