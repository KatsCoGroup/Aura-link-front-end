import { useEffect, useId, useRef } from "react";

declare global {
  interface Window {
    TradingView?: any;
    __tvScriptLoadingPromise?: Promise<void>;
  }
}

type Props = {
  symbol: string;
  title?: string;
  interval?: string;
  height?: number;
  hideToolbar?: boolean;
  hideVolume?: boolean;
  plain?: boolean; // render without card wrapper
  className?: string;
};

export const TradingViewWidget = ({
  symbol,
  title,
  interval = "60",
  height = 360,
  hideToolbar = true,
  hideVolume = true,
  plain = false,
  className = "",
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useId();

  useEffect(() => {
    let canceled = false;

    const initWidget = () => {
      if (canceled || !containerRef.current || !window.TradingView) return;
      containerRef.current.innerHTML = "";
      new window.TradingView.widget({
        symbol,
        autosize: true,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#000000",
        enable_publishing: false,
        hide_top_toolbar: hideToolbar,
        hide_legend: hideToolbar,
        hide_side_toolbar: hideToolbar,
        allow_symbol_change: false,
        studies: hideVolume ? [] : undefined,
        container_id: widgetId,
      });
    };

    if (!window.TradingView) {
      if (!window.__tvScriptLoadingPromise) {
        window.__tvScriptLoadingPromise = new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = "tradingview-widget-script";
          script.src = "https://s3.tradingview.com/tv.js";
          script.type = "text/javascript";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject();
          document.head.appendChild(script);
        });
      }
      window.__tvScriptLoadingPromise
        .then(() => initWidget())
        .catch(() => {
          if (containerRef.current) {
            containerRef.current.innerHTML = "Failed to load chart";
          }
        });
    } else {
      initWidget();
    }

    return () => {
      canceled = true;
    };
  }, [symbol, interval, hideToolbar, hideVolume]);

  if (plain) {
    return (
      <div className={className} style={{ height }}>
        {title && <div className="text-sm font-medium mb-2">{title}</div>}
        <div id={widgetId} ref={containerRef} style={{ height: "100%" }} />
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-border bg-card p-3 ${className}`} style={{ height }}>
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      <div className="h-full">
        <div id={widgetId} ref={containerRef} style={{ height: "100%" }} />
      </div>
    </div>
  );
};
