import pygame
import sys
import random

# Initialize
pygame.init()

# Screen
WIDTH, HEIGHT = 500, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Smart Car Highway")
clock = pygame.time.Clock()

# Colors
GRAY = (50, 50, 50)
WHITE = (255, 255, 255)
YELLOW = (255, 215, 0)
BLUE = (30, 144, 255)
RED = (255, 50, 50)

# Player
car_width = 50
car_height = 80
player_x = WIDTH // 2
player_y = HEIGHT - 120
player_speed = 7

# Enemy
obstacle_width = 50
obstacle_height = 80
obstacle_x = random.randint(60, WIDTH - 100)
obstacle_y = -100
obstacle_speed = 5

# Score
score = 0
font = pygame.font.SysFont("Arial", 24)
game_over = False

# Game loop
while True:
    clock.tick(60)

    # EVENTS
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if game_over and event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                player_x = WIDTH // 2
                obstacle_y = -100
                score = 0
                game_over = False

    # KEY INPUT (THIS FIXES YOUR PROBLEM)
    keys = pygame.key.get_pressed()

    if not game_over:
        if keys[pygame.K_LEFT]:
            player_x -= player_speed
        if keys[pygame.K_RIGHT]:
            player_x += player_speed

        # Keep inside road
        player_x = max(50, min(WIDTH - 50 - car_width, player_x))

        # Move enemy
        obstacle_y += obstacle_speed

        if obstacle_y > HEIGHT:
            obstacle_y = -100
            obstacle_x = random.randint(60, WIDTH - 100)
            score += 1

        # Collision
        player_rect = pygame.Rect(player_x, player_y, car_width, car_height)
        obstacle_rect = pygame.Rect(obstacle_x, obstacle_y, obstacle_width, obstacle_height)

        if player_rect.colliderect(obstacle_rect):
            game_over = True

    # DRAW
    screen.fill(GRAY)

    # Road lines
    pygame.draw.line(screen, WHITE, (40, 0), (40, HEIGHT), 5)
    pygame.draw.line(screen, WHITE, (WIDTH - 40, 0), (WIDTH - 40, HEIGHT), 5)

    for y in range(0, HEIGHT, 40):
        pygame.draw.line(screen, YELLOW, (WIDTH // 2, y), (WIDTH // 2, y + 20), 3)

    # Player
    pygame.draw.rect(screen, BLUE, (player_x, player_y, car_width, car_height), border_radius=8)

    # Enemy
    pygame.draw.rect(screen, RED, (obstacle_x, obstacle_y, obstacle_width, obstacle_height), border_radius=8)

    # Score
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (20, 20))

    # Game Over
    if game_over:
        text1 = font.render("GAME OVER", True, RED)
        text2 = font.render("Press SPACE to Restart", True, WHITE)

        screen.blit(text1, (WIDTH // 2 - 80, HEIGHT // 2 - 40))
        screen.blit(text2, (WIDTH // 2 - 140, HEIGHT // 2))

    pygame.display.update()