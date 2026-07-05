"""
generate_og_image — creates the default Open Graph image (1200×630) and
the favicon/icon set for talhawkk.me.

Usage:
    python manage.py generate_og_image

Output:
    static/images/og-default.png    — 1200×630 social-share card
    static/icons/favicon.svg        — SVG favicon (TA monogram, teal)
    static/icons/favicon.ico        — ICO wrapper (32×32)
    static/icons/favicon-16.png    — 16×16 PNG
    static/icons/favicon-32.png    — 32×32 PNG
    static/icons/apple-touch-icon.png — 180×180 PNG
    static/icons/icon-192.png      — 192×192 Android PWA
    static/icons/icon-512.png      — 512×512 Android PWA

Re-runnable — overwrites existing files.
"""

import os
from io import BytesIO
import base64

from django.core.management.base import BaseCommand
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
from apps.core.models import SiteConfiguration


# Brand tokens
BG_COLOR = '#0a0a0f'
ACCENT_COLOR = '#2dd4bf'
ACCENT_RGB = (45, 212, 191)
WHITE = (255, 255, 255)
LIGHT_GRAY = (180, 180, 190)
BG_RGB = (10, 10, 15)

OG_W, OG_H = 1200, 630


def _safe_font(size, bold=False):
    """Try to load a system font; fall back to the Pillow default."""
    font_names = (
        'Arial Bold' if bold else 'Arial',
        'Helvetica Bold' if bold else 'Helvetica',
        'SegoeUI Bold' if bold else 'SegoeUI',
        'LiberationSans Bold' if bold else 'LiberationSans',
        'DejaVuSans Bold' if bold else 'DejaVuSans',
    )
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            continue
    try:
        return ImageFont.truetype('arial.ttf', size)
    except (OSError, IOError):
        return ImageFont.load_default()


def _draw_og_card():
    """Render the 1200×630 branded OG image."""
    img = Image.new('RGB', (OG_W, OG_H), BG_RGB)
    draw = ImageDraw.Draw(img)

    # Teal accent bar at the left
    draw.rectangle([(0, 0), (8, OG_H)], fill=ACCENT_RGB)

    # Subtle teal gradient line at the bottom
    for x in range(0, OG_W, 2):
        opacity = max(0, min(255, int(255 * (1 - x / OG_W) * 0.3)))
        draw.line([(x, OG_H - 3), (x, OG_H - 1)], fill=(ACCENT_RGB[0], ACCENT_RGB[1], ACCENT_RGB[2], opacity))

    # Name
    name_font = _safe_font(64, bold=True)
    draw.text((80, 140), 'Talha Abbas', fill=WHITE, font=name_font)

    # Title line
    title_font = _safe_font(28, bold=False)
    draw.text((80, 230), 'Python / Django Developer  ·  AI Integrator', fill=LIGHT_GRAY, font=title_font)

    # Domain
    domain_font = _safe_font(24, bold=False)
    draw.text((80, 280), 'talhawkk.me', fill=ACCENT_RGB, font=domain_font)

    # Teal decorative square cluster (bottom-right)
    sq = 12
    offsets = [(OG_W - 100, OG_H - 120), (OG_W - 80, OG_H - 100), (OG_W - 60, OG_H - 120)]
    for ox, oy in offsets:
        draw.rectangle([(ox, oy), (ox + sq, oy + sq)], fill=ACCENT_RGB)

    return img


def _draw_favicon_svg(out_path):
    """Write a minimal SVG favicon with the TA monogram."""
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0a0a0f"/>
  <text x="50" y="72" text-anchor="middle" font-size="52" font-family="Arial,Helvetica,sans-serif" font-weight="bold" fill="#2dd4bf">TA</text>
</svg>'''
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(svg)


def _draw_favicon_svg_from_image(profile_img, out_path):
    """Write an SVG favicon wrapping the base64-encoded profile image."""
    thumb = profile_img.resize((96, 96), Image.Resampling.LANCZOS)
    buffered = BytesIO()
    thumb.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <clipPath id="circleView">
    <circle cx="50" cy="50" r="50"/>
  </clipPath>
  <image width="100" height="100" href="data:image/png;base64,{img_str}" clip-path="url(#circleView)"/>
</svg>'''
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(svg)


def _draw_favicon_png(size, out_path):
    """Render a square PNG icon at the given size."""
    img = Image.new('RGBA', (size, size), (*BG_RGB, 255))
    draw = ImageDraw.Draw(img)

    # Border radius approximation via rounded rectangle
    r = size // 5
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=r, fill=(*BG_RGB, 255), outline=ACCENT_RGB, width=max(1, size // 80))

    # TA text
    font_size = int(size * 0.45)
    font = _safe_font(font_size, bold=True)
    text = 'TA'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2 - bbox[1]
    draw.text((x, y), text, fill=ACCENT_RGB, font=font)

    img.save(out_path, 'PNG')


def _png_to_ico(png_path, ico_path, sizes=(16, 32, 48)):
    """Wrap PNG(s) into an ICO file."""
    img = Image.open(png_path)
    images = [img.resize((s, s), Image.Resampling.LANCZOS) for s in sizes]
    images[0].save(ico_path, format='ICO', sizes=[(s, s) for s in sizes], append_images=images[1:])


class Command(BaseCommand):
    help = 'Generate branded OG image and favicon set for talhawkk.me'

    def handle(self, *args, **options):
        static_root = os.path.join(settings.BASE_DIR, 'static')
        img_dir = os.path.join(static_root, 'images')
        icon_dir = os.path.join(static_root, 'icons')
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(icon_dir, exist_ok=True)

        # --- OG card ---
        og_path = os.path.join(img_dir, 'og-default.png')
        og_img = _draw_og_card()
        og_img.save(og_path, 'PNG', optimize=True)
        self.stdout.write(self.style.SUCCESS(f'  OK: {og_path}  ({OG_W}x{OG_H})'))

        # --- Load profile image for favicons ---
        profile_img = None
        try:
            config_obj = SiteConfiguration.load()
            profile_path = None
            if config_obj.profile_image:
                try:
                    profile_path = config_obj.profile_image.path
                except NotImplementedError:
                    pass
            if not profile_path or not os.path.exists(profile_path):
                fallback_path = os.path.join(settings.MEDIA_ROOT, 'profile', 'profile_photo.jpeg')
                if os.path.exists(fallback_path):
                    profile_path = fallback_path
            
            if profile_path and os.path.exists(profile_path):
                raw_img = Image.open(profile_path)
                # Crop to square
                w, h = raw_img.size
                min_dim = min(w, h)
                left = (w - min_dim) // 2
                top = (h - min_dim) // 2
                right = (w + min_dim) // 2
                bottom = (h + min_dim) // 2
                profile_img = raw_img.crop((left, top, right, bottom))
                self.stdout.write(self.style.SUCCESS(f"Loaded profile image from {profile_path} to generate favicons."))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not load profile photo: {e}. Falling back to default design."))

        # --- SVG favicon ---
        svg_path = os.path.join(icon_dir, 'favicon.svg')
        if profile_img:
            _draw_favicon_svg_from_image(profile_img, svg_path)
        else:
            _draw_favicon_svg(svg_path)
        self.stdout.write(self.style.SUCCESS(f'  OK: {svg_path}'))

        # --- PNG favicons / icons ---
        png_tasks = [
            ('favicon-16.png', 16),
            ('favicon-32.png', 32),
            ('apple-touch-icon.png', 180),
            ('icon-192.png', 192),
            ('icon-512.png', 512),
        ]
        for fname, size in png_tasks:
            out = os.path.join(icon_dir, fname)
            if profile_img:
                # Resize and save profile image
                resized = profile_img.resize((size, size), Image.Resampling.LANCZOS)
                if resized.mode not in ('RGB', 'RGBA'):
                    resized = resized.convert('RGBA')
                resized.save(out, 'PNG')
            else:
                _draw_favicon_png(size, out)
            self.stdout.write(self.style.SUCCESS(f'  OK: {out}  ({size}x{size})'))

        # --- ICO ---
        ico_path = os.path.join(icon_dir, 'favicon.ico')
        _png_to_ico(os.path.join(icon_dir, 'favicon-32.png'), ico_path)
        self.stdout.write(self.style.SUCCESS(f'  OK: {ico_path}'))

        self.stdout.write(self.style.SUCCESS('\nAll assets generated. Run collectstatic to deploy.'))
