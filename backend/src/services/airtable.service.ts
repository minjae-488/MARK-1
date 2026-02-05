import axios, { AxiosInstance } from 'axios';
import { Order, OrderStatus } from '../types/airtable';

export class AirtableService {
    private readonly axios: AxiosInstance;
    private readonly BASE_ID: string;

    constructor() {
        const apiKey = process.env.AIRTABLE_API_KEY;
        this.BASE_ID = process.env.AIRTABLE_BASE_ID || '';

        if (!apiKey || !this.BASE_ID) {
            console.warn('⚠️ Airtable credentials not found in environment variables');
        }

        this.axios = axios.create({
            baseURL: 'https://api.airtable.com/v0',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * 모든 주문 조회
     * @param view (Optional) 특정 View 기준으로 조회
     */
    async getOrders(view?: string): Promise<Order[]> {
        try {
            const params: any = {};
            if (view) params.view = view;

            const response = await this.axios.get(`/${this.BASE_ID}/Orders`, { params });
            return response.data.records;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw new Error('Failed to fetch orders');
        }
    }

    /**
     * 주문 생성
     * @param fields 주문 데이터
     */
    async createOrder(fields: Order['fields']): Promise<Order> {
        try {
            const response = await this.axios.post(`/${this.BASE_ID}/Orders`, {
                fields,
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create order:', error);
            throw new Error('Failed to create order');
        }
    }

    /**
     * 주문 상태 업데이트
     * @param recordId Airtable Record ID
     * @param status 변경할 상태
     */
    async updateOrderStatus(recordId: string, status: OrderStatus): Promise<Order> {
        try {
            const response = await this.axios.patch(`/${this.BASE_ID}/Orders/${recordId}`, {
                fields: { Status: status },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to update order status:', error);
            throw new Error('Failed to update order status');
        }
    }
}
