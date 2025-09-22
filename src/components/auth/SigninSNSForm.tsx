export default function SigninSNSForm() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* <button className="flex justify-center items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
        <Image
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
          alt="Google"
          className="w-6 h-6"
          width={300}
          height={300}
        />
      </button>

      <button className="flex justify-center items-center p-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] transition-all duration-200 shadow-sm hover:shadow-md">
        <span className="text-white font-bold text-lg w-6 h-6 flex items-center justify-center">N</span>
      </button> */}

      <form
        className="w-full"
        action={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.AUTH_KAKAO_ID}&redirect_uri=${process.env.AUTH_KAKAO_REDIRECT_URL}&response_type=code`}
        method="GET"
      >
        <button className="w-full flex justify-center items-center p-3 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] transition-all duration-200 shadow-sm hover:shadow-md">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 3.125C5.5375 3.125 2 5.73125 2 8.9375C2 11.0937 3.4 13.0062 5.5 14.0812C5.3 14.6375 4.775 16.3625 4.725 16.5937C4.65 16.9062 4.9125 16.9062 5.0625 16.8125C5.1875 16.7312 7.25 15.4 8.025 14.9C8.675 15.0125 9.3375 15.0687 10 15.0687C14.4625 15.0687 18 12.4625 18 9.25625C18 6.05 14.4625 3.125 10 3.125Z"
              fill="#391B1B"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
