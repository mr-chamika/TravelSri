# TravelSri Brand Guidelines

## Color System

### Primary Brand Color

Our primary brand color is a vibrant yellow:

- **Main Yellow**: `#FEFA17`
- **Hover/Darker Yellow**: `#F6F200` 
- **Even Darker Yellow**: `#E6E200`
- **Light Yellow (for backgrounds)**: `rgba(254, 250, 23, 0.1)`

### Usage

The primary brand color (#FEFA17) should be used for:

- Primary buttons
- Important UI elements that need emphasis
- Selected states
- Brand accents

## Usage in Code

### Direct Usage in Tailwind CSS

```jsx
<button className="bg-[#FEFA17] hover:bg-[#F6F200] text-black">
  Button Text
</button>
```

### Using ColorUtils

We've created a color utility system that can be imported:

```jsx
import { brandColors, getBrandColorClass } from '../utils/colorUtils';

// Use directly in inline styles
<div style={{ backgroundColor: brandColors.primary.main }}>Element</div>

// Or use the helper function for class names
<div className={getBrandColorClass('bg', 'primary', 'main')}>Element</div>
```

### Theme System

For more complex styling needs, use our theme system:

```jsx
import theme from '../styles/theme';

// Use in styled-components or other CSS-in-JS solutions
const StyledComponent = styled.div`
  background-color: ${theme.colors.brand.primary.main};
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borders.radius.md};
`;
```

## Components Using Brand Colors

We've created common UI components that already use the brand colors:

- `<BrandButton>` - Use for all buttons to maintain consistent styling
- `<StatusBadge>` - For showing status indicators (success, warning, etc.)
- `<TabNavigation>` - For tab interfaces with the brand styling

## Chart Colors

For charts and data visualizations:

```jsx
import { chartColors, getBrandChartColors } from '../utils/chartUtils';

// Use predefined chart colors
const chartData = {
  datasets: [{
    backgroundColor: chartColors.yellow.primary,
    // ...other dataset properties
  }]
};

// Or use colors derived from the brand palette
const chartData = {
  datasets: [{
    backgroundColor: getBrandChartColors('primary').main,
    // ...other dataset properties
  }]
};
```

## Best Practices

1. **Consistency**: Always use the color system rather than hardcoding values
2. **Accessibility**: Ensure text has sufficient contrast against backgrounds
3. **Hierarchy**: Use color to establish visual hierarchy and TGuide users
4. **Sparingly**: Use the bright yellow (#FEFA17) as an accent, not for large areas
5. **Testing**: Test how the yellow appears on different screens and devices