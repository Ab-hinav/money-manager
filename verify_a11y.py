import re

def verify_mobile_sidebar():
    with open('frontend/app/(dashboard)/_components/mobile-sidebar.tsx', 'r') as f:
        content = f.read()
        if 'aria-label="Open menu"' in content:
            print("✅ Mobile sidebar trigger has aria-label")
        else:
            print("❌ Mobile sidebar trigger missing aria-label")

def verify_sidebar():
    with open('frontend/app/(dashboard)/_components/sidebar.tsx', 'r') as f:
        content = f.read()
        if 'aria-label="Collapse sidebar"' in content and 'title="Collapse sidebar"' in content:
            print("✅ Collapse button has aria-label and title")
        else:
            print("❌ Collapse button missing aria-label or title")

        if 'aria-label="Expand sidebar"' in content and 'title="Expand sidebar"' in content:
            print("✅ Expand button has aria-label and title")
        else:
            print("❌ Expand button missing aria-label or title")

        if 'aria-label={collapsed ? "Logout" : undefined}' in content and 'title={collapsed ? "Logout" : undefined}' in content:
            print("✅ Logout button has conditional aria-label and title")
        else:
            print("❌ Logout button missing conditional aria-label or title")

print("Running a11y verification...")
verify_mobile_sidebar()
verify_sidebar()
