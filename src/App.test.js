import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor, cleanup, } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach, } from 'vitest';
import { App } from './App';
import { MantineProvider } from '@mantine/core';
const mockLaunches = [
    {
        flight_number: 1,
        mission_name: 'FalconSat',
        rocket: { rocket_name: 'Falcon 1' },
        links: {
            mission_patch: 'https://images2.imgbox.com/40/e3/GypSkayF_o.png',
            mission_patch_small: 'https://images2.imgbox.com/3c/0e/T8iJcSN3_o.png',
        },
        details: 'Engine failure at 33 seconds and loss of vehicle',
    },
    {
        flight_number: 2,
        mission_name: 'DemoSat',
        rocket: { rocket_name: 'Falcon 1' },
        links: {
            mission_patch: 'https://images2.imgbox.com/be/e7/iNqsqVYM_o.png',
            mission_patch_small: 'https://images2.imgbox.com/4f/e3/I0lkuJ2e_o.png',
        },
        details: 'Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage',
    },
];
describe('SpaceX Launches App — Тестирование пользовательских сценариев', () => {
    let modalRoot;
    beforeEach(() => {
        modalRoot =
            document.getElementById('modal-root') || document.createElement('div');
        modalRoot.setAttribute('id', 'modal-root');
        if (!document.body.contains(modalRoot)) {
            document.body.appendChild(modalRoot);
        }
    });
    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });
    const renderWithProvider = (ui) => {
        return render(_jsx(MantineProvider, { children: ui }));
    };
    it('1. Отображение индикатора загрузки', () => {
        renderWithProvider(_jsx(App, {}));
        expect(screen.getByRole('heading', { level: 1, name: /SpaceX Launches 2020/i })).toBeInTheDocument();
        expect(document.querySelector('.mantine-Loader-root')).toBeInTheDocument();
    });
    it('2. Рендер карточки запуска', async () => {
        renderWithProvider(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('FalconSat')).toBeInTheDocument();
            expect(screen.getByText('DemoSat')).toBeInTheDocument();
        });
    });
    it('3. Отображение ошибки, если API вернул сбой', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
        }));
        renderWithProvider(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });
    it('4. Открытие модального окна', async () => {
        const user = userEvent.setup();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLaunches,
        }));
        renderWithProvider(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('FalconSat')).toBeInTheDocument();
        });
        const seeMoreButton = screen.getAllByRole('button', { name: /see more/i });
        await user.click(seeMoreButton[0]);
        await waitFor(() => {
            expect(screen.getByText('Engine failure at 33 seconds and loss of vehicle')).toBeInTheDocument();
        });
    });
    it('5. Закрытие модального окна при клике на кнопку', async () => {
        const user = userEvent.setup();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLaunches,
        }));
        renderWithProvider(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('FalconSat')).toBeInTheDocument();
        });
        const seeMoreButton = screen.getAllByRole('button', { name: /see more/i });
        await user.click(seeMoreButton[0]);
        await waitFor(() => {
            expect(screen.getByText('Engine failure at 33 seconds and loss of vehicle')).toBeInTheDocument();
        });
        const closeButton = screen.getAllByRole('button', { name: /close modal/i });
        await user.click(closeButton[0]);
        expect(screen.queryByText('Engine failure at 33 seconds and loss of vehicle')).not.toBeInTheDocument();
    });
    it('6. Закрытие модального окна при нажатии на клавишу Esc', async () => {
        const user = userEvent.setup();
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockLaunches,
        }));
        renderWithProvider(_jsx(App, {}));
        await waitFor(() => {
            expect(screen.getByText('DemoSat')).toBeInTheDocument();
        });
        const seeMoreButton = screen.getAllByRole('button', { name: /see more/i });
        await user.click(seeMoreButton[1]);
        await waitFor(() => {
            expect(screen.getByText('Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage')).toBeInTheDocument();
        });
        await user.keyboard('{Escape}');
        expect(screen.queryByText('Successful first stage burn and transition to second stage, maximum altitude 289 km, Premature engine shutdown at T+7 min 30 s, Failed to reach orbit, Failed to recover first stage')).not.toBeInTheDocument();
    });
});
