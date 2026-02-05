import axios from 'axios';
import { AirtableService } from '../../../src/services/airtable.service';
import { Order, OrderStatus } from '../../../src/types/airtable';

// Axios Mock
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AirtableService', () => {
    let service: AirtableService;
    const BASE_ID = 'test_base_id';
    const API_KEY = 'test_api_key';

    // Create Mock Instance
    const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        defaults: { headers: { common: {} } }
    };

    beforeEach(() => {
        // 환경 변수 설정
        process.env.AIRTABLE_BASE_ID = BASE_ID;
        process.env.AIRTABLE_API_KEY = API_KEY;

        // axios.create가 mockAxiosInstance를 반환하도록 설정
        mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

        service = new AirtableService();
        jest.clearAllMocks();
    });

    describe('getOrders', () => {
        it('should fetch orders successfully', async () => {
            // Given
            const mockOrders = [
                { id: 'rec1', fields: { 'Order ID': 'ORD-001' } },
                { id: 'rec2', fields: { 'Order ID': 'ORD-002' } },
            ];

            mockAxiosInstance.get.mockResolvedValue({
                data: { records: mockOrders }
            });

            // When
            const result = await service.getOrders();

            // Then
            expect(result).toHaveLength(2);
            expect(result[0].fields['Order ID']).toBe('ORD-001');
            expect(mockAxiosInstance.get).toHaveBeenCalledWith(
                `/${BASE_ID}/Orders`,
                expect.objectContaining({
                    params: {}
                })
            );
        });

        it('should handle API errors', async () => {
            // Given
            mockAxiosInstance.get.mockRejectedValue(new Error('API Error'));

            // When & Then
            await expect(service.getOrders()).rejects.toThrow('Failed to fetch orders');
        });
    });

    describe('createOrder', () => {
        it('should create order successfully', async () => {
            // Given
            const newOrderData = {
                'Order ID': 'ORD-NEW',
                'Channel': 'Smartstore',
                'Status': 'Paid',
                'Product Name': 'Test Product',
                'Quantity': 1,
                'Order Amount': 10000
            };

            mockAxiosInstance.post.mockResolvedValue({
                data: { id: 'recNew', fields: newOrderData }
            });

            // When
            const result = await service.createOrder(newOrderData as any);

            // Then
            expect(result.id).toBe('recNew');
            expect(mockAxiosInstance.post).toHaveBeenCalledWith(
                `/${BASE_ID}/Orders`,
                { fields: newOrderData }
            );
        });
    });

    describe('updateOrderStatus', () => {
        it('should update status successfully', async () => {
            // Given
            const recordId = 'rec123';
            const newStatus: OrderStatus = 'Shipped';

            mockAxiosInstance.patch.mockResolvedValue({
                data: { id: recordId, fields: { Status: newStatus } }
            });

            // When
            await service.updateOrderStatus(recordId, newStatus);

            // Then
            expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
                `/${BASE_ID}/Orders/${recordId}`,
                { fields: { Status: newStatus } }
            );
        });
    });
});
