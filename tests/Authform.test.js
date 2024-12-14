import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import AuthForm from '../components/AuthForm'; // Adjust the path based on your project structure

// Mock Axios
const mock = new MockAdapter(axios);

beforeEach(() => {
    mock.reset(); // Reset mock data before each test
});

describe('AuthForm Component', () => {
    test('renders the login form by default', () => {
        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Check if Login form fields are rendered
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    test('switches to signup form when switch button is clicked', () => {
        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Click on "Switch to Sign Up"
        const switchButton = screen.getByRole('button', { name: /switch to sign up/i });
        fireEvent.click(switchButton);

        // Check if Sign Up form fields are rendered
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    });

    test('handles successful login', async () => {
        // Mock the login API response
        mock.onPost('http://localhost:4000/api/v1/login').reply(200, {
            token: 'mockToken',
            role: 'user',
            message: 'Login Successful',
        });

        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Fill in login fields and submit the form
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for successful message
        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('mockToken');
            expect(localStorage.getItem('role')).toBe('user');
            expect(screen.queryByText(/something went wrong/i)).toBeNull();
        });
    });

    test('displays error on failed login', async () => {
        // Mock the login API response for failure
        mock.onPost('http://localhost:4000/api/v1/login').reply(401, {
            message: 'Invalid credentials',
        });

        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Fill in login fields with incorrect data
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for error message
        const errorMessage = await screen.findByText(/something went wrong/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('handles successful signup', async () => {
        // Mock the signup API response
        mock.onPost('http://localhost:4000/api/v1/signup').reply(200, {
            token: 'mockSignupToken',
            role: 'user',
            message: 'Signup Successful',
        });

        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Switch to Sign Up form
        const switchButton = screen.getByRole('button', { name: /switch to sign up/i });
        fireEvent.click(switchButton);

        // Fill in signup fields and submit
        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for successful message
        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('mockSignupToken');
            expect(localStorage.getItem('role')).toBe('user');
        });
    });

    test('displays error on failed signup', async () => {
        // Mock the signup API response for failure
        mock.onPost('http://localhost:4000/api/v1/signup').reply(500);

        render(
            <BrowserRouter>
                <AuthForm />
            </BrowserRouter>
        );

        // Switch to Sign Up form
        const switchButton = screen.getByRole('button', { name: /switch to sign up/i });
        fireEvent.click(switchButton);

        // Fill in signup fields with incorrect data
        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for error message
        const errorMessage = await screen.findByText(/something went wrong/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
