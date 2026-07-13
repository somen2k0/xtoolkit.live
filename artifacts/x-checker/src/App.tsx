import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { MobileNav } from "@/components/layout/MobileNav";
import { usePageTracking } from "@/hooks/use-track";
import { ThemeProvider } from "@/lib/theme";
import { Loader2 } from "lucide-react";

// Eagerly loaded — Home is the LCP page, lazy-loading it adds a fatal 2-3s delay
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// All other top-level pages lazy-loaded to keep the initial bundle minimal
const AdminPage = lazy(() => import("@/pages/admin"));
const ChromeExtension = lazy(() => import("@/pages/chrome-extension"));
const CwsScreenshots = lazy(() => import("@/pages/cws-screenshots"));
const Tools = lazy(() => import("@/pages/tools"));
const About = lazy(() => import("@/pages/about"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Contact = lazy(() => import("@/pages/contact"));
// Lazy-loaded tool pages
const UsernameGenerator = lazy(() => import("@/pages/tools/username-generator"));
const HashtagFormatter = lazy(() => import("@/pages/tools/hashtag-formatter"));
const TweetFormatter = lazy(() => import("@/pages/tools/tweet-formatter"));
const CharacterCounter = lazy(() => import("@/pages/tools/character-counter"));
const JsonFormatter = lazy(() => import("@/pages/tools/json-formatter"));
const Base64Tool = lazy(() => import("@/pages/tools/base64"));
const CssMinifier = lazy(() => import("@/pages/tools/css-minifier"));
const HtmlFormatter = lazy(() => import("@/pages/tools/html-formatter"));
const JwtDecoder = lazy(() => import("@/pages/tools/jwt-decoder"));
const RegexTester = lazy(() => import("@/pages/tools/regex-tester"));
const SqlFormatter = lazy(() => import("@/pages/tools/sql-formatter"));
const UrlEncoder = lazy(() => import("@/pages/tools/url-encoder"));
const UuidGenerator = lazy(() => import("@/pages/tools/uuid-generator"));
const CaseConverter = lazy(() => import("@/pages/tools/case-converter"));
const YamlJson = lazy(() => import("@/pages/tools/yaml-json"));
const TimezoneConverter = lazy(() => import("@/pages/tools/timezone-converter"));
// New utility tools (lazy)
const PasswordGenerator = lazy(() => import("@/pages/tools/password-generator"));
const QrCodeGenerator = lazy(() => import("@/pages/tools/qr-code-generator"));
const ImageCompressor = lazy(() => import("@/pages/tools/image-compressor"));
const ColorPicker = lazy(() => import("@/pages/tools/color-picker"));
const WordCounter = lazy(() => import("@/pages/tools/word-counter"));
const CssGradientGenerator = lazy(() => import("@/pages/tools/css-gradient-generator"));
const CssBoxShadowGenerator = lazy(() => import("@/pages/tools/css-box-shadow-generator"));
const JsFormatter = lazy(() => import("@/pages/tools/js-formatter"));
const HashGenerator = lazy(() => import("@/pages/tools/hash-generator"));
const ImageResizer = lazy(() => import("@/pages/tools/image-resizer"));
// SEO Tools (lazy)
const MetaTagGenerator = lazy(() => import("@/pages/tools/meta-tag-generator"));
const UrlSlugGenerator = lazy(() => import("@/pages/tools/url-slug-generator"));
const KeywordDensity = lazy(() => import("@/pages/tools/keyword-density"));
const RobotsTxtGenerator = lazy(() => import("@/pages/tools/robots-txt-generator"));
const SitemapValidator = lazy(() => import("@/pages/tools/sitemap-validator"));
// Email Tools (lazy)
const SubjectLineGenerator = lazy(() => import("@/pages/tools/subject-line-generator"));
const EmailSignatureGenerator = lazy(() => import("@/pages/tools/email-signature-generator"));
const EmailValidator = lazy(() => import("@/pages/tools/email-validator"));
const TempGmail = lazy(() => import("@/pages/tools/temp-gmail"));
const XAccountChecker = lazy(() => import("@/pages/tools/x-account-checker"));
const AiDetector = lazy(() => import("@/pages/tools/ai-detector"));
const BioGenerator = lazy(() => import("@/pages/tools/bio-generator"));
const FunnyBios = lazy(() => import("@/pages/tools/funny-bios"));
// Email privacy tools (lazy)
const MaskedEmailGenerator = lazy(() => import("@/pages/tools/masked-email-generator"));
const SchemaGenerator = lazy(() => import("@/pages/tools/schema-generator"));
const ResumeBuilder = lazy(() => import("@/pages/tools/resume-builder"));
const SpamScoreChecker = lazy(() => import("@/pages/tools/spam-score-checker"));
const NewsletterTemplateGenerator = lazy(() => import("@/pages/tools/newsletter-template-generator"));
// Guides (lazy)
const Guides = lazy(() => import("@/pages/guides"));
// Blog (lazy)
const BlogIndex = lazy(() => import("@/pages/blog/index"));
const WhatIsDisposableEmail = lazy(() => import("@/pages/blog/what-is-disposable-email"));
const BestTempMailServices = lazy(() => import("@/pages/blog/best-temp-mail-services"));
const TempMailVsGmail = lazy(() => import("@/pages/blog/temp-mail-vs-gmail"));
const IsTempMailSafe = lazy(() => import("@/pages/blog/is-temp-mail-safe"));
const WhyWebsitesAskEmailVerification = lazy(() => import("@/pages/blog/why-websites-ask-email-verification"));
const TempGmailExplained = lazy(() => import("@/pages/blog/temp-gmail-explained"));
const HowToUseTempEmailExtension = lazy(() => import("@/pages/blog/how-to-use-temp-email-extension"));
const WhatIsJsonLd = lazy(() => import("@/pages/blog/what-is-json-ld"));
const WhatIsBase64 = lazy(() => import("@/pages/blog/what-is-base64"));
const TwitterBioTips = lazy(() => import("@/pages/blog/twitter-bio-tips"));
const WhatIsUuid = lazy(() => import("@/pages/blog/what-is-uuid"));
const UrlEncodingGuide = lazy(() => import("@/pages/blog/url-encoding-guide"));
const WhatIsRegex = lazy(() => import("@/pages/blog/what-is-regex"));
const SeoMetaTagsGuide = lazy(() => import("@/pages/blog/seo-meta-tags-guide"));
const WhatIsJwt = lazy(() => import("@/pages/blog/what-is-jwt"));
const TempMailCompleteGuide = lazy(() => import("@/pages/blog/temp-mail-complete-guide"));
const BulkTwitterAccountChecker = lazy(() => import("@/pages/blog/bulk-twitter-account-checker"));
const FreeTempGmail = lazy(() => import("@/pages/blog/free-temp-gmail"));
const JsonLdSchemaGenerator = lazy(() => import("@/pages/blog/json-ld-schema-generator"));
const GmailAccountCheckerBlog = lazy(() => import("@/pages/blog/gmail-account-checker"));
const TempMailGuides = lazy(() => import("@/pages/blog/temp-mail-guides"));
const XBioWritingGuide = lazy(() => import("@/pages/blog/x-bio-writing-guide"));
const WhatIsAMetaTag = lazy(() => import("@/pages/blog/what-is-a-meta-tag"));
const WhatIsAQrCode = lazy(() => import("@/pages/blog/what-is-a-qr-code"));
// Category pages (lazy)
const AiWritingTools = lazy(() => import("@/pages/categories/ai-writing-tools"));
const SocialMediaTools = lazy(() => import("@/pages/categories/social-media-tools"));
const TextFormatTools = lazy(() => import("@/pages/categories/text-format-tools"));
const DeveloperTools = lazy(() => import("@/pages/categories/developer-tools"));
const SeoTools = lazy(() => import("@/pages/categories/seo-tools"));
const EmailTools = lazy(() => import("@/pages/categories/email-tools"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function TrackedRouter() {
  usePageTracking();
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/tools" component={Tools} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/contact" component={Contact} />

          {/* Text & Formatting Tools */}
          <Route path="/tools/username-generator" component={UsernameGenerator} />
          <Route path="/tools/hashtag-formatter" component={HashtagFormatter} />
          <Route path="/tools/tweet-formatter" component={TweetFormatter} />
          <Route path="/tools/character-counter" component={CharacterCounter} />
          <Route path="/tools/word-counter" component={WordCounter} />

          {/* Developer Tools */}
          <Route path="/tools/json-formatter" component={JsonFormatter} />
          <Route path="/tools/base64" component={Base64Tool} />
          <Route path="/tools/css-minifier" component={CssMinifier} />
          <Route path="/tools/html-formatter" component={HtmlFormatter} />
          <Route path="/tools/jwt-decoder" component={JwtDecoder} />
          <Route path="/tools/regex-tester" component={RegexTester} />
          <Route path="/tools/sql-formatter" component={SqlFormatter} />
          <Route path="/tools/url-encoder" component={UrlEncoder} />
          <Route path="/tools/uuid-generator" component={UuidGenerator} />
          <Route path="/tools/case-converter" component={CaseConverter} />
          <Route path="/tools/yaml-json" component={YamlJson} />
          <Route path="/tools/timezone-converter" component={TimezoneConverter} />
          <Route path="/tools/password-generator" component={PasswordGenerator} />
          <Route path="/tools/color-picker" component={ColorPicker} />
          <Route path="/tools/qr-code-generator" component={QrCodeGenerator} />
          <Route path="/tools/image-compressor" component={ImageCompressor} />
          <Route path="/tools/css-gradient-generator" component={CssGradientGenerator} />
          <Route path="/tools/css-box-shadow-generator" component={CssBoxShadowGenerator} />
          <Route path="/tools/js-formatter" component={JsFormatter} />
          <Route path="/tools/hash-generator" component={HashGenerator} />
          <Route path="/tools/image-resizer" component={ImageResizer} />

          {/* AI Tools */}
          <Route path="/tools/ai-detector" component={AiDetector} />

          {/* SEO Tools */}
          <Route path="/tools/meta-tag-generator" component={MetaTagGenerator} />
          <Route path="/tools/url-slug-generator" component={UrlSlugGenerator} />
          <Route path="/tools/keyword-density" component={KeywordDensity} />
          <Route path="/tools/robots-txt-generator" component={RobotsTxtGenerator} />
          <Route path="/tools/sitemap-validator" component={SitemapValidator} />
          <Route path="/tools/schema-generator" component={SchemaGenerator} />
          <Route path="/tools/resume-builder" component={ResumeBuilder} />

          {/* Email Tools */}
          <Route path="/tools/subject-line-generator" component={SubjectLineGenerator} />
          <Route path="/tools/email-signature-generator" component={EmailSignatureGenerator} />
          <Route path="/tools/email-validator" component={EmailValidator} />
          <Route path="/tools/spam-score-checker" component={SpamScoreChecker} />
          <Route path="/tools/newsletter-template-generator" component={NewsletterTemplateGenerator} />
          <Route path="/tools/masked-email-generator" component={MaskedEmailGenerator} />
          <Route path="/tools/temp-mail/tempemail">
            {() => <TempGmail defaultTab="disposable" />}
          </Route>
          <Route path="/tools/temp-mail/disposable">
            {() => <Redirect to="/tools/temp-mail/tempemail" />}
          </Route>
          <Route path="/tools/temp-mail/tempgmail">
            {() => <TempGmail defaultTab="tempgmail" />}
          </Route>
          <Route path="/tools/temp-mail/gmail-tricks">
            {() => <TempGmail defaultTab="gmail" />}
          </Route>
          <Route path="/tools/temp-mail">
            {() => <Redirect to="/tools/temp-mail/tempemail" />}
          </Route>
          <Route path="/tools/temp-gmail">
            {() => <Redirect to="/tools/temp-mail/tempgmail" />}
          </Route>

          {/* Social media X tools */}
          <Route path="/tools/x-account-checker" component={XAccountChecker} />
          <Route path="/tools/bio-generator" component={BioGenerator} />

          {/* Real tool — not a redirect stub */}
          <Route path="/tools/funny-bios" component={FunnyBios} />

          {/* Guides */}
          <Route path="/guides" component={Guides} />

          {/* Blog */}
          <Route path="/blog" component={BlogIndex} />
          <Route path="/blog/what-is-disposable-email" component={WhatIsDisposableEmail} />
          <Route path="/blog/best-temp-mail-services" component={BestTempMailServices} />
          <Route path="/blog/temp-mail-vs-gmail" component={TempMailVsGmail} />
          <Route path="/blog/is-temp-mail-safe" component={IsTempMailSafe} />
          <Route path="/blog/why-websites-ask-email-verification" component={WhyWebsitesAskEmailVerification} />
          <Route path="/blog/temp-gmail-explained" component={TempGmailExplained} />
          <Route path="/blog/how-to-use-temp-email-extension" component={HowToUseTempEmailExtension} />
          <Route path="/blog/what-is-json-ld" component={WhatIsJsonLd} />
          <Route path="/blog/what-is-base64" component={WhatIsBase64} />
          <Route path="/blog/twitter-bio-tips" component={TwitterBioTips} />
          <Route path="/blog/what-is-uuid" component={WhatIsUuid} />
          <Route path="/blog/url-encoding-guide" component={UrlEncodingGuide} />
          <Route path="/blog/what-is-regex" component={WhatIsRegex} />
          <Route path="/blog/seo-meta-tags-guide" component={SeoMetaTagsGuide} />
          <Route path="/blog/what-is-jwt" component={WhatIsJwt} />
          <Route path="/blog/temp-mail-complete-guide" component={TempMailCompleteGuide} />
          <Route path="/blog/bulk-twitter-account-checker" component={BulkTwitterAccountChecker} />
          <Route path="/blog/free-temp-gmail" component={FreeTempGmail} />
          <Route path="/blog/json-ld-schema-generator" component={JsonLdSchemaGenerator} />
          <Route path="/blog/gmail-account-checker" component={GmailAccountCheckerBlog} />
          <Route path="/blog/temp-mail-guides" component={TempMailGuides} />
          <Route path="/blog/x-bio-writing-guide" component={XBioWritingGuide} />
          <Route path="/blog/what-is-a-meta-tag" component={WhatIsAMetaTag} />
          <Route path="/blog/what-is-a-qr-code" component={WhatIsAQrCode} />

          {/* Category landing pages */}
          <Route path="/ai-writing-tools" component={AiWritingTools} />
          <Route path="/social-media-tools" component={SocialMediaTools} />
          <Route path="/text-format-tools" component={TextFormatTools} />
          <Route path="/developer-tools" component={DeveloperTools} />
          <Route path="/seo-tools" component={SeoTools} />
          <Route path="/email-tools" component={EmailTools} />

          <Route path="/chrome-extension" component={ChromeExtension} />
          <Route path="/cws-screenshots" component={CwsScreenshots} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Global animated background — covers every page */}
          <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: "-200px", left: "-200px",
              width: "700px", height: "700px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,57,10,0.18) 0%, transparent 65%)",
              animation: "bg-drift-1 18s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", top: "30%", right: "-220px",
              width: "650px", height: "650px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,57,10,0.14) 0%, transparent 65%)",
              animation: "bg-drift-2 24s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", bottom: "-150px", left: "30%",
              width: "600px", height: "600px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,196,181,0.22) 0%, transparent 65%)",
              animation: "bg-drift-3 28s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", top: "60%", left: "-100px",
              width: "400px", height: "400px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,57,10,0.10) 0%, transparent 65%)",
              animation: "bg-drift-2 20s ease-in-out infinite reverse",
            }} />
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <TrackedRouter />
              <CookieBanner />
              <MobileNav />
            </WouterRouter>
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
