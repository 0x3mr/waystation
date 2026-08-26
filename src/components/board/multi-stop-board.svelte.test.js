// @vitest-environment jsdom
import { render, cleanup } from '@testing-library/svelte';
import { describe, test, expect, afterEach } from 'vitest';
import MultiStopBoard from './multi-stop-board.svelte';

const now = new Date('2026-08-25T23:02:00Z');

function stop(id, arrivals = [], extra = {}) {
	return {
		id,
		code: id.split('_')[1],
		name: `Stop ${id}`,
		direction: 'N',
		arrivals,
		failed: false,
		...extra
	};
}

function arrival(overrides = {}) {
	return {
		route: '249',
		name: 'Route 249',
		dest: 'South Bellevue Station',
		min: 6,
		delta: -2,
		status: 'EARLY',
		stopName: '',
		departureAt: now.getTime() + 6 * 60000,
		tripId: `t-${Math.random()}`,
		...overrides
	};
}

describe('MultiStopBoard', () => {
	afterEach(() => cleanup());

	test('renders one card per stop with stop code and direction', () => {
		const { container } = render(MultiStopBoard, {
			props: { stops: [stop('1_100'), stop('1_200')], now, lastUpdatedAt: now.getTime() }
		});
		expect(container.querySelectorAll('section').length).toBe(2);
		expect(container.innerHTML).toContain('STOP #100');
		expect(container.innerHTML).toContain('Northbound');
	});

	test('spells out status phrase and caps rows per card by grid shape', () => {
		const many = Array.from({ length: 8 }, () => arrival());
		const stops = Array.from({ length: 5 }, (_, i) => stop(`1_${i}`, many));
		const { container } = render(MultiStopBoard, {
			props: { stops, now, lastUpdatedAt: now.getTime() }
		});
		const firstCard = container.querySelector('section');
		expect(firstCard.querySelectorAll('.route-badge').length).toBe(4);
		expect(firstCard.innerHTML).toContain('2 MIN EARLY');
	});

	test('two stops show up to six departures each', () => {
		const many = Array.from({ length: 8 }, () => arrival());
		const { container } = render(MultiStopBoard, {
			props: { stops: [stop('1_1', many), stop('1_2', many)], now, lastUpdatedAt: now.getTime() }
		});
		expect(container.querySelector('section').querySelectorAll('.route-badge').length).toBe(6);
	});

	test('shows empty and failed states per card', () => {
		const { container } = render(MultiStopBoard, {
			props: {
				stops: [stop('1_1'), stop('1_2', [], { failed: true })],
				now,
				lastUpdatedAt: now.getTime()
			}
		});
		expect(container.innerHTML).toContain('NO UPCOMING DEPARTURES');
		expect(container.innerHTML).toContain('DATA UNAVAILABLE');
	});

	test('renders the alert band when an alert is present', () => {
		const { container } = render(MultiStopBoard, {
			props: {
				stops: [stop('1_1')],
				now,
				lastUpdatedAt: now.getTime(),
				alert: { summary: { value: 'Route 226 canceled tonight' }, severity: 'alert' }
			}
		});
		expect(container.innerHTML).toContain('Route 226 canceled tonight');
		expect(container.querySelector('.alert-alert')).not.toBeNull();
	});
});
