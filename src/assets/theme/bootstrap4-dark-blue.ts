import aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

/**
 * PrimeVue 3 shipped precompiled theme stylesheets under `primevue/resources/themes/`,
 * and this app was designed against `bootstrap4-dark-blue`. PrimeVue 4 removed that
 * directory entirely — only the Aura, Lara, Material and Nora token presets remain — so
 * the original look has to be rebuilt as a preset.
 *
 * Every value below is transcribed from the original
 * `primevue@3/resources/themes/bootstrap4-dark-blue/theme.css`, so the app keeps the
 * palette it was designed with. Aura supplies everything not listed here.
 *
 * Only `button`, `tabs` and `togglebutton` need component-level overrides: the rest of
 * the library resolves its colours through the semantic layer, so overriding `surface`,
 * `primary`, `formField`, `content`, `overlay`, `text` and friends is enough.
 */

/** `--surface-*` of the original theme, remapped onto the scale Aura's dark scheme uses. */
const surface = {
  0: '#ffffff',
  50: '#e9e9ea',
  100: '#d2d4d5',
  200: '#bcbec0',
  300: '#a6a8ab',
  400: '#909397',
  500: '#63676d',
  600: '#4d5158',
  700: '#3f4b5b', // --surface-border
  800: '#363c43',
  900: '#2a323d', // --surface-card / --surface-overlay
  950: '#20262e' // --surface-ground
};

/** `--primary-*` of the original theme. 950 is extrapolated; the scale stopped at 900. */
const primary = {
  50: '#f9fdff',
  100: '#e4f4ff',
  200: '#ceebff',
  300: '#b8e2ff',
  400: '#a3d9ff',
  500: '#8dd0ff',
  600: '#78b1d9',
  700: '#6392b3',
  800: '#4e728c',
  900: '#385366',
  950: '#2c414f'
};

const textColor = 'rgba(255, 255, 255, 0.87)';
const mutedColor = 'rgba(255, 255, 255, 0.6)';
const primaryColor = '#8dd0ff';
const primaryContrast = '#151515';
const primaryFocusHighlight = '#64bfff';
const borderColor = '#3f4b5b';
const focusRingColor = '#e3f3fe';

/**
 * The theme's button severities. Aura reaches for palette entries such as `{red.400}`,
 * which do not line up with these, so each one is spelled out.
 *
 * `base`/`hover`/`active` are the solid variant; `border` is the solid variant's border
 * (which differs from its background); outlined and text variants tint the base colour
 * at 4% and 16%, exactly as the original stylesheet did.
 */
const severities = {
  primary: { base: primaryColor, hover: '#56bdff', active: '#1dadff', text: primaryContrast },
  secondary: { base: '#6c757d', hover: '#5a6268', active: '#545b62', text: '#ffffff' },
  success: {
    base: '#9fdaa8',
    hover: '#78cc86',
    active: '#5ac06c',
    text: primaryContrast,
    border: '#78cc86'
  },
  info: {
    base: '#7fd8e6',
    hover: '#4cc8db',
    active: '#26bdd3',
    text: primaryContrast,
    border: '#4cc8db'
  },
  warn: {
    base: '#ffe082',
    hover: '#ffd54f',
    active: '#ffca28',
    text: primaryContrast,
    border: '#ffd54f'
  },
  help: {
    base: '#b7a2e0',
    hover: '#9a7cd4',
    active: '#845fca',
    text: primaryContrast,
    border: '#9a7cd4'
  },
  danger: {
    base: '#f19ea6',
    hover: '#e97984',
    active: '#f75965',
    text: primaryContrast,
    border: '#e97984'
  },
  contrast: { base: '#ffffff', hover: '#d2d4d5', active: '#bcbec0', text: '#20262e' }
} as const;

type Severity = keyof typeof severities;
const severityNames = Object.keys(severities) as Severity[];

const fromEntries = <T>(build: (name: Severity) => T) =>
  Object.fromEntries(severityNames.map((name) => [name, build(name)]));

/** `rgba()` of the base colour, matching the original 4% / 16% tints. */
const tint = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const buttonRoot = fromEntries((name) => {
  const s = severities[name];
  const border = 'border' in s ? s.border : s.base;
  return {
    background: s.base,
    hoverBackground: s.hover,
    activeBackground: s.active,
    borderColor: border,
    hoverBorderColor: s.hover,
    activeBorderColor: s.active,
    color: s.text,
    hoverColor: s.text,
    activeColor: s.text,
    focusRing: { color: focusRingColor, shadow: 'none' }
  };
});

const buttonOutlined = fromEntries((name) => {
  const s = severities[name];
  return {
    hoverBackground: tint(s.base, 0.04),
    activeBackground: tint(s.base, 0.16),
    borderColor: s.base,
    color: s.base
  };
});

const buttonText = fromEntries((name) => {
  const s = severities[name];
  return {
    hoverBackground: tint(s.base, 0.04),
    activeBackground: tint(s.base, 0.16),
    color: s.base
  };
});

export default definePreset(aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '3px',
      md: '4px', // --border-radius
      lg: '5px',
      xl: '6px'
    }
  },
  semantic: {
    primary,
    focusRing: {
      width: '1px',
      style: 'solid',
      color: focusRingColor,
      offset: '0',
      shadow: 'none'
    },
    colorScheme: {
      dark: {
        surface,
        primary: {
          color: primaryColor,
          contrastColor: primaryContrast,
          hoverColor: '#56bdff',
          activeColor: '#1dadff'
        },
        // --highlight-bg / --highlight-text-color: a solid fill, not Aura's tinted one.
        // A highlighted row that also has focus darkens one step.
        highlight: {
          background: primaryColor,
          focusBackground: primaryFocusHighlight,
          color: primaryContrast,
          focusColor: primaryContrast
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.4)', // --maskbg
          color: textColor
        },
        text: {
          color: textColor,
          hoverColor: textColor,
          mutedColor: mutedColor,
          hoverMutedColor: mutedColor
        },
        content: {
          background: surface[900],
          hoverBackground: 'rgba(255, 255, 255, 0.04)', // --surface-hover
          borderColor: borderColor,
          color: textColor,
          hoverColor: textColor
        },
        overlay: {
          select: { background: surface[900], borderColor: borderColor, color: textColor },
          popover: { background: surface[900], borderColor: borderColor, color: textColor },
          modal: { background: surface[900], borderColor: borderColor, color: textColor }
        },
        list: {
          option: {
            focusBackground: 'rgba(255, 255, 255, 0.04)',
            selectedBackground: primaryColor,
            selectedFocusBackground: primaryFocusHighlight,
            color: textColor,
            focusColor: textColor,
            selectedColor: primaryContrast,
            selectedFocusColor: primaryContrast
          }
        },
        navigation: {
          item: {
            focusBackground: 'rgba(255, 255, 255, 0.04)',
            activeBackground: 'rgba(255, 255, 255, 0.04)',
            color: textColor,
            focusColor: textColor,
            activeColor: textColor
          }
        },
        formField: {
          background: surface[950],
          disabledBackground: surface[800],
          filledBackground: surface[950],
          filledHoverBackground: surface[950],
          filledFocusBackground: surface[950],
          borderColor: borderColor,
          hoverBorderColor: borderColor,
          focusBorderColor: primaryColor,
          invalidBorderColor: severities.danger.base,
          color: textColor,
          disabledColor: mutedColor,
          placeholderColor: mutedColor,
          iconColor: mutedColor,
          shadow: 'none',
          focusRing: {
            width: '1px',
            style: 'solid',
            color: focusRingColor,
            offset: '0',
            shadow: 'none'
          }
        }
      }
    }
  },
  components: {
    button: {
      colorScheme: {
        dark: { root: buttonRoot, outlined: buttonOutlined, text: buttonText }
      }
    },
    /**
     * Card-style tabs. The active tab paints its bottom border in the panel colour so it
     * reads as opening into the content; the inactive ones hide their side borders and
     * carry on the tab list's underline. Aura's sliding active bar is switched off.
     */
    tabs: {
      colorScheme: {
        dark: {
          tablist: {
            background: 'transparent',
            borderColor: borderColor,
            borderWidth: '0 0 1px 0'
          },
          tab: {
            background: surface[900],
            hoverBackground: surface[900],
            activeBackground: surface[900],
            borderWidth: '1px',
            borderColor: `${surface[900]} ${surface[900]} ${borderColor} ${surface[900]}`,
            hoverBorderColor: borderColor,
            activeBorderColor: `${borderColor} ${borderColor} ${surface[900]} ${borderColor}`,
            color: mutedColor,
            hoverColor: mutedColor,
            activeColor: mutedColor,
            padding: '0.75rem 1rem',
            margin: '0 0 -1px 0'
          },
          tabpanel: {
            background: surface[900],
            color: textColor,
            padding: '0'
          },
          activeBar: {
            height: '0'
          }
        }
      }
    },
    /** The original renders toggle buttons in the secondary palette, not a tinted pill. */
    togglebutton: {
      colorScheme: {
        dark: {
          root: {
            background: severities.secondary.base,
            hoverBackground: severities.secondary.hover,
            checkedBackground: severities.secondary.active,
            borderColor: severities.secondary.base,
            checkedBorderColor: '#4e555b',
            color: severities.secondary.text,
            hoverColor: severities.secondary.text,
            checkedColor: severities.secondary.text
          },
          content: {
            checkedBackground: 'transparent',
            checkedShadow: 'none'
          },
          icon: {
            color: severities.secondary.text,
            hoverColor: severities.secondary.text,
            checkedColor: severities.secondary.text
          }
        }
      }
    },
    /**
     * A 4px square handle on a thin track, rather than Aura's round knob.
     *
     * Aura draws the handle as a ring: the `handle` box is the border, and a `content`
     * pseudo-element painted in the surface colour sits inside it. Here the content
     * fills the handle, so it is the content — not the handle — whose colour is the one
     * the reader sees, and both have to be set or the surface shows through.
     */
    slider: {
      track: { background: borderColor, size: '0.286rem' },
      range: { background: primaryColor },
      handle: {
        width: '1.143rem',
        height: '1.143rem',
        borderRadius: '4px',
        background: primaryColor,
        hoverBackground: severities.primary.hover,
        content: {
          borderRadius: '4px',
          hoverBackground: severities.primary.hover,
          width: '1.143rem',
          height: '1.143rem',
          shadow: 'none'
        }
      },
      colorScheme: {
        // Aura pins the content to `{surface.950}` per scheme, which outranks the
        // scheme-agnostic block above.
        dark: {
          handle: {
            content: { background: primaryColor }
          }
        }
      }
    }
  }
});
