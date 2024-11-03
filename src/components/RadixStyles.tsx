import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

export function StyledTabs({ children }) {
  return (
    <Tabs className="w-full">
      <TabsList className="flex space-x-1 rounded bg-blue-500 p-1">
        {/* Tabs triggers */}
      </TabsList>
      {children}
    </Tabs>
  );
}
