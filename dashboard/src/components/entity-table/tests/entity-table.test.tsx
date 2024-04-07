import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import user from "@testing-library/user-event"
import { EntityTable } from '..'
import { fetchMockApi } from './fetch-entity.mock'
import { mockColumns } from './columns.mock'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@marzneshin/utils'
import '@testing-library/jest-dom'
import {
    MockDeleteConfirmationDialog,
    MockDialog,
    MockSettingsDialog
} from './dialogs.mock'



describe("Entity Table", () => {
    afterEach(() => {
        cleanup()
    })

    it('Renders Successfuly', () => {
        const entityTable = render(
            <QueryClientProvider client={queryClient}>
                <EntityTable
                    fetchEntity={fetchMockApi}
                    MutationDialog={MockDialog}
                    DeleteConfirmationDialog={MockDeleteConfirmationDialog}
                    SettingsDialog={MockSettingsDialog}
                    columnsFn={mockColumns}
                    filteredColumn="name"
                    entityKey="users"
                />
            </QueryClientProvider>
        )

        expect(entityTable).toBeTruthy()
    })

    it('Mutation Dialog Invoked for Entity Creation when clicked on Create button', async () => {
        const entityTable = render(
            <QueryClientProvider client={queryClient}>
                <EntityTable
                    fetchEntity={fetchMockApi}
                    MutationDialog={MockDialog}
                    DeleteConfirmationDialog={MockDeleteConfirmationDialog}
                    SettingsDialog={MockSettingsDialog}
                    columnsFn={mockColumns}
                    filteredColumn="name"
                    entityKey="users"
                />
            </QueryClientProvider>
        )
        const createBtn = await entityTable.findByLabelText('create-users')
        await user.click(createBtn)

        const createDialog = await screen.findByTestId("create-mutation-dialog")
        expect(createDialog).toBeTruthy()
        expect(createDialog).toBeInTheDocument();

    })

    describe('Entity Table Pagination', () => {
        it('Paginate entities', () => { })
    })
})
