import { createI18n } from "vue-i18n";
import en from "./en/en.json";
import es from "./es/es.json";

const i18n = createI18n({
    locale: "en",
    messages:{
        en: en,
        es: es
    }
});

export default i18n;