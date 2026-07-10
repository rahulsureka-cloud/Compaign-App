import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TemplateList from '../Templates/TemplateList';
import { TEMPLATES } from '../Templates/templateData';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockReset();
});

test('renders all template titles', () => {
  render(<MemoryRouter><TemplateList /></MemoryRouter>);
  TEMPLATES.forEach((tpl) => {
    expect(screen.getByText(tpl.title)).toBeInTheDocument();
  });
});

test('clicking "Use template" navigates to the wizard with the template in router state', () => {
  render(<MemoryRouter><TemplateList /></MemoryRouter>);

  const buttons = screen.getAllByRole('button', { name: 'Use template' });
  expect(buttons).toHaveLength(TEMPLATES.length);

  fireEvent.click(buttons[0]);

  expect(mockNavigate).toHaveBeenCalledWith(
    '/campaigns/new',
    { state: { template: TEMPLATES[0].campaign } }
  );
});
