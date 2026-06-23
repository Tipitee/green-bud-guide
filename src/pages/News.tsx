import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/news/NewsCard";
import NewsFilters from "@/components/news/NewsFilters";
import { newsItems } from "@/data/newsData";
import { Capacitor } from "@capacitor/core";

const News: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredNews = activeTab === "all" ? newsItems : newsItems.filter(item => item.category === activeTab);
  const displayedNews = filteredNews.slice(0, visibleCount);
  const hasMore = displayedNews.length < filteredNews.length;
  const isGerman = i18n.language === 'de';
  const isIOS = Capacitor.getPlatform() === 'ios';
  const isNativePlatform = Capacitor.isNativePlatform();

  const loadMore = () => setVisibleCount(prev => prev + 4);

  return (
    <div className="page-container">
      {isIOS && isNativePlatform && <div className="ios-status-bar" aria-hidden="true" />}
      <main className="page-content" role="main">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
          {t('navigation.news')}
        </h1>
        <div className="mb-8">
          <NewsFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
            {filteredNews.length} {t('news.results')}
          </p>
          <div className="space-y-6" role="list" aria-label={t('navigation.news')}>
            {displayedNews.map(item => (
              <div key={item.id} role="listitem">
                <NewsCard item={item} isGerman={isGerman} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} variant="outline" className="border-border text-foreground hover:bg-accent/20">
                {t('news.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </main>
      {isIOS && isNativePlatform && <div className="ios-bottom-safe" aria-hidden="true" />}
    </div>
  );
};

export default News;
