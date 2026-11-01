import { test, expect } from '@fixtures/baseTest';

test('the health endpoints report ok', { tag: '@smoke' }, async ({ request }) => {
    for (const path of ['/health', '/api/health']) {
        const response = await request.get(path);
        expect(response, path).toBeOK();
        expect(await response.json()).toEqual({ status: 'ok' });
    }
});

test.describe('runs API', { tag: '@regression' }, () => {
    test('lists the seeded runs, newest first', async ({ request }) => {
        const response = await request.get('/api/runs');
        expect(response).toBeOK();
        const runs = await response.json();
        expect(runs).toHaveLength(8);
        expect(runs[0]).toMatchObject({ name: 'Login Flow', status: 'passed', branch: 'release/1.2' });
    });

    test('filters by status and by name', async ({ request }) => {
        const failed = await (await request.get('/api/runs', { params: { status: 'failed' } })).json();
        expect(failed.map((run: { name: string }) => run.name)).toEqual(['Notifications API', 'Search Indexing']);

        const search = await (await request.get('/api/runs', { params: { search: 'checkout' } })).json();
        expect(search.map((run: { name: string }) => run.name)).toEqual(['Checkout Regression']);
    });

    test('rejects an invalid status filter', async ({ request }) => {
        const response = await request.get('/api/runs', { params: { status: 'nope' } });
        expect(response.status()).toBe(400);
    });

    test('creates a run that can be fetched by id', async ({ request }) => {
        const created = await request.post('/api/runs', { data: { name: 'API created run', branch: 'feature/api' } });
        expect(created.status()).toBe(201);
        const run = await created.json();
        expect(run).toMatchObject({ name: 'API created run', branch: 'feature/api', status: 'queued' });

        const fetched = await request.get(`/api/runs/${run.id}`);
        expect(fetched).toBeOK();
        expect(await fetched.json()).toEqual(run);
    });

    test('returns field errors for an invalid run', async ({ request }) => {
        const response = await request.post('/api/runs', { data: { name: 'ab' } });
        expect(response.status()).toBe(400);
        const { errors } = await response.json();
        expect(errors).toEqual({
            name: 'Name must be at least 3 characters',
            branch: 'Branch is required',
        });
    });

    test('updates a status and rejects invalid ones', async ({ request }) => {
        const updated = await request.patch('/api/runs/5', { data: { status: 'running' } });
        expect(updated).toBeOK();
        expect(await updated.json()).toMatchObject({ id: 5, status: 'running' });

        const invalid = await request.patch('/api/runs/5', { data: { status: 'bogus' } });
        expect(invalid.status()).toBe(400);
    });

    test('returns 404 for a missing run', async ({ request }) => {
        expect((await request.get('/api/runs/9999')).status()).toBe(404);
        expect((await request.patch('/api/runs/9999', { data: { status: 'passed' } })).status()).toBe(404);
    });
});
