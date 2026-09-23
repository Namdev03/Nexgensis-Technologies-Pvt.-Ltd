import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncLogin } from "../Store/userSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            username: formData.get("username"),
            email:formData.get("email"),
            password: formData.get("password"),
        };
        dispatch(asyncLogin(payload));
    };
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-gray-500">
                        Login to your account to continue
                    </p>
                </div>
                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                outline-none transition
                focus:border-black focus:ring-2 focus:ring-gray-200
                placeholder:text-gray-400"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                outline-none transition
                focus:border-black focus:ring-2 focus:ring-gray-200
                placeholder:text-gray-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-gray-600 hover:text-black transition"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                outline-none transition
                focus:border-black focus:ring-2 focus:ring-gray-200
                placeholder:text-gray-400"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 accent-black"
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-gray-600 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-black px-4 py-3
              text-sm font-semibold text-white
              transition hover:bg-gray-800
              active:scale-[0.99]
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {error && (
                        <p role="alert" className="mt-4 text-center text-sm text-red-600">
                            {typeof error === "string" ? error : "Unable to log in. Please try again."}
                        </p>
                    )}

                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="font-semibold text-black hover:underline"
                        >
                            Create account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
