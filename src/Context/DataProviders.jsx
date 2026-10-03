import { UserProvider } from "./userContext";
import { CustomerProvider } from "./CustomerContext";
import { AnnouncementProvider } from "./AnnouncementContext";
import { TicketProvider } from "./TicketsContext";
import { FeedProvider } from "./FeedContext";
import { PromotionalProvider } from "./PromotionalContext";
import { ProductProvider } from "./ProductsContext";
import { DealersContextProvider } from "./DealersContext";
import { CodesProvider } from "./CodesContext";
import { TrackQRDataProvider } from "./TrackQRDataContext";
import { RedemptionsContextProvider } from "./RedemptionContext";
import { CatalogProvider } from "./CatalogContext";
import { DashboardProvider } from "./DashboardContext";
import { SettingsProvider } from "./SettingsContext";

/**
 * All data contexts. Mounted only inside the signed-in area (and keyed by admin in App routes),
 * so nothing is fetched on the login page and every login starts with fresh data.
 */
export default function DataProviders({ children }) {
  return (
    <DashboardProvider>
      <SettingsProvider>
        <CatalogProvider>
          <RedemptionsContextProvider>
            <TrackQRDataProvider>
              <CodesProvider>
                <DealersContextProvider>
                  <ProductProvider>
                    <PromotionalProvider>
                      <FeedProvider>
                        <TicketProvider>
                          <AnnouncementProvider>
                            <CustomerProvider>
                              <UserProvider>{children}</UserProvider>
                            </CustomerProvider>
                          </AnnouncementProvider>
                        </TicketProvider>
                      </FeedProvider>
                    </PromotionalProvider>
                  </ProductProvider>
                </DealersContextProvider>
              </CodesProvider>
            </TrackQRDataProvider>
          </RedemptionsContextProvider>
        </CatalogProvider>
      </SettingsProvider>
    </DashboardProvider>
  );
}
