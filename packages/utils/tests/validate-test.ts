import { validateIconSet } from '../lib/icon-set/validate';

describe('Testing validation', () => {
	test('Not object', () => {
		return new Promise((fulfill, reject) => {
			try {
				validateIconSet(void 0);
				reject('Expected to throw error on undefined');
				return;
			} catch {
				//
			}

			try {
				validateIconSet({});
				reject('Expected to throw error on empty object');
				return;
			} catch {
				//
			}

			try {
				validateIconSet(null);
				reject('Expected to throw error on null');
				return;
			} catch {
				//
			}

			try {
				validateIconSet([]);
				reject('Expected to throw error on array');
				return;
			} catch {
				//
			}

			fulfill(true);
		});
	});

	test('Valid set', () => {
		expect(
			validateIconSet({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			})
		).toEqual({
			prefix: 'foo',
			icons: {
				bar: {
					body: '<g />',
				},
			},
		});
	});

	test('Missing stuff', () => {
		return new Promise((fulfill, reject) => {
			try {
				validateIconSet({
					prefix: 'foo',
				});
				reject('Expected to throw error when icons are missing');
				return;
			} catch {
				//
			}

			try {
				validateIconSet({
					prefix: 'foo',
					icons: {},
				});
				reject('Expected to throw error when icons are empty');
				return;
			} catch {
				//
			}

			try {
				validateIconSet([]);
				reject('Expected to throw error on array');
				return;
			} catch {
				//
			}

			fulfill(true);
		});
	});

	test('Characters', () => {
		return new Promise((fulfill, reject) => {
			// Correct icon set
			expect(
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					aliases: {
						baz: {
							parent: 'bar',
							hFlip: true,
						},
					},
					chars: {
						e00: 'bar',
						e01: 'baz',
					},
				})
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				aliases: {
					baz: {
						parent: 'bar',
						hFlip: true,
					},
				},
				chars: {
					e00: 'bar',
					e01: 'baz',
				},
			});

			// Missing icon
			try {
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					chars: {
						e01: 'baz',
					},
				});
				reject(
					'Expected to throw error when character points to missing icon'
				);
				return;
			} catch {
				//
			}

			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						chars: {
							e01: 'baz',
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
			});

			// Bad character
			try {
				validateIconSet({
					prefix: 'foo',
					icons: {
						bar: {
							body: '<g />',
						},
					},
					chars: {
						test: 'bar',
					},
				});
				reject('Expected to throw error when character is invalid');
				return;
			} catch {
				//
			}

			expect(
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							bar: {
								body: '<g />',
							},
						},
						chars: {
							// Valid character
							'e000-f123': 'bar',
							// Multiple invalid characters
							'test': 'bar',
							'E0': 'bar',
						},
					},
					{ fix: true }
				)
			).toEqual({
				prefix: 'foo',
				icons: {
					bar: {
						body: '<g />',
					},
				},
				chars: {
					'e000-f123': 'bar',
				},
			});

			fulfill(true);
		});
	});

	test('Invalid default values', () => {
		return new Promise((fulfill, reject) => {
			try {
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							icon1: {
								body: '<path d="icon1" />',
							},
						},
						height: 24,
						// Object
						width: {
							foo: 1,
						},
					},
					{ fix: true }
				);
				reject('Expected to throw error for bad default properties');
				return;
			} catch {
				//
			}

			try {
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							icon1: {
								body: '<path d="icon1" />',
							},
						},
						height: 24,
						// Object
						left: null,
					},
					{ fix: true }
				);
				reject('Expected to throw error for bad default properties');
				return;
			} catch {
				//
			}

			try {
				validateIconSet(
					{
						prefix: 'foo',
						icons: {
							icon1: {
								body: '<path d="icon1" />',
							},
						},
						height: 24,
						// String
						width: '32',
					},
					{ fix: true }
				);
				reject('Expected to throw error for bad default properties');
				return;
			} catch {
				//
			}

			fulfill(true);
		});
	});
});
