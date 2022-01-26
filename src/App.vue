<template>
  <div class="min-h-screen flex flex-col bg-light-blue">
    <header class="text-gray-600 body-font bg-gradient-to-t from-light-blue to-sky-blue">
      <div class="container mx-auto flex flex-wrap p-5 flex-row items-center">
        <a class="flex title-font font-medium items-center text-gray-900 mt-1 mb-4 md:mb-0" target="_blank" href="https://metamounts.io/">
          <img class="lg:w-16 w-10  object-cover object-center rounded-full border border-gray-300 shadow-lg" alt="warchest" src="https://metamounts.io/king-yeti.png" />
        </a>
        <nav class="ml-auto flex flex-wrap items-center text-base justify-center">
        </nav>
        <a target="_blank" href="https://twitter.com/metamounts" class="inline-flex items-center bg-transparent border-0 px-2 focus:outline-none rounded text-base">
          <svg fill="#ffffff" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-8 h-8 lg:w-11 lg:h-11 ml-1" viewBox="0 0 20 20">
            <path d="M17.316 6.246c.008.162.011.326.011.488c0 4.99-3.797 10.742-10.74 10.742c-2.133 0-4.116-.625-5.787-1.697a7.577 7.577 0 0 0 5.588-1.562a3.779 3.779 0 0 1-3.526-2.621a3.858 3.858 0 0 0 1.705-.065a3.779 3.779 0 0 1-3.028-3.703v-.047a3.766 3.766 0 0 0 1.71.473a3.775 3.775 0 0 1-1.168-5.041a10.716 10.716 0 0 0 7.781 3.945a3.813 3.813 0 0 1-.097-.861a3.773 3.773 0 0 1 3.774-3.773a3.77 3.77 0 0 1 2.756 1.191a7.602 7.602 0 0 0 2.397-.916a3.789 3.789 0 0 1-1.66 2.088a7.55 7.55 0 0 0 2.168-.594a7.623 7.623 0 0 1-1.884 1.953z"></path>
          </svg>
        </a>
        <a target="_blank" href="https://discord.gg/" class="inline-flex items-center bg-transparent border-0 pl-3 focus:outline-none rounded text-base">
          <svg fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-8 h-8 lg:w-11 lg:h-11 ml-1" viewBox="0 0 16 16">
            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0a8.258 8.258 0 0 0-.412-.833a.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059a.051.051 0 0 0-.018-.011a8.875 8.875 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066a.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085a8.254 8.254 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.235 13.235 0 0 0 4.001-2.02a.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612c0-.889.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612zm5.316 0c-.788 0-1.438-.724-1.438-1.612c0-.889.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612z"></path>
          </svg>
        </a>
      </div>
    </header>
    <div class="mb-auto">
      <div class="p-10">
        <router-view />
      </div>
    </div>
    <footer class="text-gray-600 body-font border-white border-t">
      <div class="bg-sky-blue">
        <div class="container px-5 py-3 lg:py-5 mx-auto flex items-center sm:flex-row flex-col">
          <p class="text-xs tracking-tightest text-white sm:ml-6 sm:mt-0 mt-4">Powered by Gemworks - an open source Solana project
          </p>
          <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a class="text-white" target="_blank" href='https://discord.gg/'>
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0a12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055a20.03 20.03 0 0 0 5.993 2.98a.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963c.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878a.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-2.981a.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38c0-1.312.956-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38c0-1.312.955-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.946 2.38-2.157 2.38z"></path>
              </svg>
            </a>
            <a class="ml-3 text-white" target="_blank" href='https://twitter.com/metamounts'>
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  font-family: 'Press Start 2P', monospace;
}
input[type='radio']:checked + span {
  @apply text-black;
}

.nes-container.with-title>.title {
    background-color: #EAF5F9;
}

.nes-container {
    border-color: #326273;
}
</style>
