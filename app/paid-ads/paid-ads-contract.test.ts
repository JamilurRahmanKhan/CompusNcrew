import assert from "node:assert/strict";
import test from "node:test";

import * as paidAdsData from "./paid-ads-data";

interface PaidAdsRenderContract {
  previewDecks: readonly {
    platform: string;
    previews: readonly { image: string }[];
  }[];
  performanceCards: readonly {
    platform: string;
    name: string;
    logo: string;
  }[];
  capabilities: readonly { title: string }[];
}

function getRenderContract(): PaidAdsRenderContract {
  const contract = (
    paidAdsData as unknown as { paidAdsRenderContract?: PaidAdsRenderContract }
  ).paidAdsRenderContract;

  assert.ok(contract, "paidAdsRenderContract must define the executable page data contract");
  return contract;
}

test("wires all six preview creatives in the approved platform and numerical order", () => {
  const contract = getRenderContract();

  assert.deepEqual(
    contract.previewDecks.map((deck) => ({
      platform: deck.platform,
      images: deck.previews.map((preview) => preview.image),
    })),
    [
      {
        platform: "google",
        images: [
          "/paid-ads/google-ads-1.jpg",
          "/paid-ads/google-ads-2.jpg",
          "/paid-ads/google-ads-3.jpg",
        ],
      },
      {
        platform: "meta",
        images: [
          "/paid-ads/meta-ads-1.jpg",
          "/paid-ads/meta-ads-2.jpg",
          "/paid-ads/meta-ads-3.jpg",
        ],
      },
    ],
  );
});

test("exposes exactly two platform cards and four capability items", () => {
  const contract = getRenderContract();

  assert.deepEqual(
    contract.performanceCards.map(({ platform, name, logo }) => ({ platform, name, logo })),
    [
      { platform: "google", name: "Google Ads", logo: "/paid-ads/google-ads-logo.png" },
      { platform: "meta", name: "Meta Ads", logo: "/paid-ads/meta-logo.png" },
    ],
  );
  assert.deepEqual(
    contract.capabilities.map(({ title }) => title),
    [
      "Campaign architecture",
      "Creative direction",
      "Conversion tracking",
      "Weekly optimization",
    ],
  );
});
