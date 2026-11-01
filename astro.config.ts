import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
    site: "https://farhan-dev.com",
    integrations: [sitemap(), pagefind(), icon()],
    vite: {
        plugins: [tailwindcss()]
    }
});