import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeeklyAdherenceChart } from '@/components/WeeklyAdherenceChart';

describe('WeeklyAdherenceChart', () => {
  it('renders the header label', () => {
    render(
      <WeeklyAdherenceChart
        data={[
          { date: '04-01', percentage: 80 },
          { date: '04-02', percentage: 90 },
        ]}
      />,
    );
    expect(screen.getByText('Daily adherence %')).toBeTruthy();
  });
});
