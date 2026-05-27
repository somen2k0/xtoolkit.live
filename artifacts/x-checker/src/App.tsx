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
import NotFound from "@/pages/not-found";
import AdminPage from "@/pages/admin";
import Home from "@/pages/home";
import ChromeExtension from "@/pages/chrome-extension";
import CwsScreenshots from "@/pages/cws-screenshots";
import Tools from "@/pages/tools";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
// Lazy-loaded tool pages
const UsernameGenerator = lazy(() => import("@/pages/tools/username-generator"));
const HashtagFormatter = lazy(() => import("@/pages/tools/hashtag-formatter"));
const TweetFormatter = lazy(() => import("@/pages/tools/tweet-formatter"));
const FontPreview = lazy(() => import("@/pages/tools/font-preview"));
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
const OgImagePreview = lazy(() => import("@/pages/tools/og-image-preview"));
// New utility tools (lazy)
const PasswordGenerator = lazy(() => import("@/pages/tools/password-generator"));
const QrCodeGenerator = lazy(() => import("@/pages/tools/qr-code-generator"));
const ImageCompressor = lazy(() => import("@/pages/tools/image-compressor"));
const ColorPicker = lazy(() => import("@/pages/tools/color-picker"));
const WordCounter = lazy(() => import("@/pages/tools/word-counter"));
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
const ProfileLinkGenerator = lazy(() => import("@/pages/tools/profile-link-generator"));
const AtFormatter = lazy(() => import("@/pages/tools/at-formatter"));
const BioGenerator = lazy(() => import("@/pages/tools/bio-generator"));
const FunnyBios = lazy(() => import("@/pages/tools/funny-bios"));
// Email privacy tools (lazy)
const MaskedEmailGenerator = lazy(() => import("@/pages/tools/masked-email-generator"));
// Previously coming-soon tools (lazy)
const TweetScheduler = lazy(() => import("@/pages/tools/tweet-scheduler"));
const PageSpeedChecker = lazy(() => import("@/pages/tools/page-speed-checker"));
const SchemaGenerator = lazy(() => import("@/pages/tools/schema-generator"));
const SpamScoreChecker = lazy(() => import("@/pages/tools/spam-score-checker"));
const NewsletterTemplateGenerator = lazy(() => import("@/pages/tools/newsletter-template-generator"));
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
          <Route path="/pricing" component={Pricing} />
          <Route path="/contact" component={Contact} />

          {/* Text & Formatting Tools */}
          <Route path="/tools/username-generator" component={UsernameGenerator} />
          <Route path="/tools/hashtag-formatter" component={HashtagFormatter} />
          <Route path="/tools/tweet-formatter" component={TweetFormatter} />
          <Route path="/tools/font-preview" component={FontPreview} />
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
          <Route path="/tools/og-image-preview" component={OgImagePreview} />
          <Route path="/tools/password-generator" component={PasswordGenerator} />
          <Route path="/tools/color-picker" component={ColorPicker} />
          <Route path="/tools/qr-code-generator" component={QrCodeGenerator} />
          <Route path="/tools/image-compressor" component={ImageCompressor} />

          {/* AI Tools */}
          <Route path="/tools/ai-detector" component={AiDetector} />

          {/* SEO Tools */}
          <Route path="/tools/meta-tag-generator" component={MetaTagGenerator} />
          <Route path="/tools/url-slug-generator" component={UrlSlugGenerator} />
          <Route path="/tools/keyword-density" component={KeywordDensity} />
          <Route path="/tools/robots-txt-generator" component={RobotsTxtGenerator} />
          <Route path="/tools/sitemap-validator" component={SitemapValidator} />
          <Route path="/tools/page-speed-checker" component={PageSpeedChecker} />
          <Route path="/tools/schema-generator" component={SchemaGenerator} />

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
          <Route path="/tools/profile-link-generator" component={ProfileLinkGenerator} />
          <Route path="/tools/at-formatter" component={AtFormatter} />
          <Route path="/tools/bio-generator" component={BioGenerator} />
          <Route path="/tools/tweet-scheduler" component={TweetScheduler} />

          {/* Redirects for removed/renamed tools */}
          <Route path="/tools/bio-ideas">{() => <Redirect to="/tools/bio-generator" />}</Route>
          <Route path="/tools/aesthetic-bios">{() => <Redirect to="/tools/bio-generator" />}</Route>
          <Route path="/tools/funny-bios" component={FunnyBios} />
          <Route path="/tools/professional-bios">{() => <Redirect to="/tools/bio-generator" />}</Route>
          <Route path="/tools/name-ideas">{() => <Redirect to="/tools/username-generator" />}</Route>
          <Route path="/tools/backlink-analyzer">{() => <Redirect to="/tools/keyword-density" />}</Route>
          <Route path="/tools/plain-text-formatter">{() => <Redirect to="/tools/email-tools" />}</Route>
          <Route path="/tools/email-character-counter">{() => <Redirect to="/tools/character-counter" />}</Route>
          <Route path="/tools/email-username-generator">{() => <Redirect to="/tools/email-tools" />}</Route>
          <Route path="/tools/follower-analyzer">{() => <Redirect to="/tools/x-account-checker" />}</Route>
          <Route path="/tools/profile-audit">{() => <Redirect to="/tools/x-account-checker" />}</Route>
          <Route path="/tools/spam-risk-checker">{() => <Redirect to="/tools/spam-score-checker" />}</Route>
          <Route path="/tools/email-privacy-checker">{() => <Redirect to="/tools/masked-email-generator" />}</Route>
          <Route path="/tools/email-leak-checker">{() => <Redirect to="/tools/temp-mail" />}</Route>
          <Route path="/tools/alias-email-explainer">{() => <Redirect to="/tools/masked-email-generator" />}</Route>
          <Route path="/tools/disposable-email-guide">{() => <Redirect to="/tools/temp-mail" />}</Route>

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
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <TrackedRouter />
            <CookieBanner />
            <MobileNav />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
