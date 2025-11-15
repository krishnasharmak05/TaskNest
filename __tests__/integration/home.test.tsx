/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react"
import Home from "@/app/home/page"
import { server } from "@/__mocks__/server"
import { http, HttpResponse } from "msw"

// Mock the Navbar component
jest.mock('/components/navbar', () => ({
  Navbar: () => <div>Navbar Mock</div>
}))

describe("Home Page Integration Tests", () => {
  test("shows loading state initially", () => {
    render(<Home />)

    expect(screen.getByText(/loading projects/i)).toBeInTheDocument()
  })

  test("renders projects fetched from API", async () => {
    render(<Home />)

    // Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading projects/i)).not.toBeInTheDocument()
    })

    // Then check for project content
    expect(screen.getByText("Integration Testing FTW")).toBeInTheDocument()
    expect(screen.getByText("Testing Dashboard component")).toBeInTheDocument()
    expect(screen.getByText(/view/i)).toBeInTheDocument()
  })

  test("renders 'No projects yet' if API returns empty list", async () => {
    server.use(
      http.get("/api/projects", () => {
        return HttpResponse.json([], { status: 200 })
      })
    )

    render(<Home />)

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument()
    expect(screen.getByText(/create your first project/i)).toBeInTheDocument()
  })

  test("handles API failure gracefully", async () => {
    server.use(
      http.get("/api/projects", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<Home />)

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    expect(screen.getByText(/no projects yet/i)).toBeInTheDocument()
  })
})